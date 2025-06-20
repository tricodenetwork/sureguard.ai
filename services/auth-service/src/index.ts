import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { createClient } from "redis"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import speakeasy from "speakeasy"
import QRCode from "qrcode"
import { Pool } from "pg"
import { z } from "zod"
import type { Request, Response, NextFunction } from "express"

const app = express()
const PORT = process.env.PORT || 3000

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Redis connection
const redis = createClient({
  url: process.env.REDIS_URL,
})

redis.on("error", (err) => console.error("Redis Client Error", err))
redis.connect()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  organizationName: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  mfaToken: z.string().optional(),
})

// Types
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  twoFactorEnabled: boolean
  organizationId?: string
}

interface AuthRequest extends Request {
  user?: User
}

// JWT utilities
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  )

  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" })

  return { accessToken, refreshToken }
}

// Authentication middleware
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Check if token is blacklisted
    const isBlacklisted = await redis.get(`blacklist:${token}`)
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token has been revoked" })
    }

    // Get user from database
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, role, two_factor_enabled, organization_id FROM users WHERE id = $1",
      [decoded.userId],
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" })
    }

    req.user = {
      id: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      role: result.rows[0].role,
      twoFactorEnabled: result.rows[0].two_factor_enabled,
      organizationId: result.rows[0].organization_id,
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" })
  }
}

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() })
})

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, organizationName } = registerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create organization if provided
    let organizationId = null
    if (organizationName) {
      const orgResult = await pool.query(
        "INSERT INTO organizations (name, created_at) VALUES ($1, NOW()) RETURNING id",
        [organizationName],
      )
      organizationId = orgResult.rows[0].id
    }

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, organization_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email, first_name, last_name, role`,
      [email, hashedPassword, firstName, lastName, organizationId],
    )

    const user = userResult.rows[0]
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      twoFactorEnabled: false,
      organizationId,
    })

    // Store refresh token
    await redis.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken)

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        twoFactorEnabled: false,
      },
      tokens,
    })
  } catch (error) {
    console.error("Registration error:", error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors })
    }
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, mfaToken } = loginSchema.parse(req.body)

    // Get user
    const userResult = await pool.query(
      `SELECT id, email, password_hash, first_name, last_name, role, 
              two_factor_enabled, two_factor_secret, organization_id,
              failed_login_attempts, locked_until
       FROM users WHERE email = $1`,
      [email],
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = userResult.rows[0]

    // Check if account is locked
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(423).json({ error: "Account is temporarily locked" })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      // Increment failed attempts
      await pool.query("UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1", [user.id])

      // Lock account after 5 failed attempts
      if (user.failed_login_attempts >= 4) {
        await pool.query("UPDATE users SET locked_until = NOW() + INTERVAL '15 minutes' WHERE id = $1", [user.id])
      }

      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check MFA if enabled
    if (user.two_factor_enabled) {
      if (!mfaToken) {
        return res.status(200).json({ requiresMFA: true })
      }

      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: "base32",
        token: mfaToken,
        window: 2,
      })

      if (!verified) {
        return res.status(401).json({ error: "Invalid MFA token" })
      }
    }

    // Reset failed attempts
    await pool.query(
      "UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = $1",
      [user.id],
    )

    const userObj: User = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      twoFactorEnabled: user.two_factor_enabled,
      organizationId: user.organization_id,
    }

    const tokens = generateTokens(userObj)

    // Store refresh token
    await redis.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken)

    res.json({
      user: {
        id: userObj.id,
        email: userObj.email,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        role: userObj.role,
        twoFactorEnabled: userObj.twoFactorEnabled,
      },
      tokens,
    })
  } catch (error) {
    console.error("Login error:", error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors })
    }
    res.status(500).json({ error: "Internal server error" })
  }
})

// Refresh token
app.post("/api/auth/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any

    // Check if refresh token exists in Redis
    const storedToken = await redis.get(`refresh:${decoded.userId}`)
    if (storedToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" })
    }

    // Get user
    const userResult = await pool.query(
      "SELECT id, email, first_name, last_name, role, two_factor_enabled, organization_id FROM users WHERE id = $1",
      [decoded.userId],
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "User not found" })
    }

    const user = userResult.rows[0]
    const userObj: User = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      twoFactorEnabled: user.two_factor_enabled,
      organizationId: user.organization_id,
    }

    const tokens = generateTokens(userObj)

    // Update refresh token
    await redis.setEx(`refresh:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken)

    res.json({ tokens })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(401).json({ error: "Invalid refresh token" })
  }
})

// Logout
app.post("/api/auth/logout", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1]

    if (token) {
      // Blacklist the access token
      const decoded = jwt.decode(token) as any
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000)
      await redis.setEx(`blacklist:${token}`, expiresIn, "true")
    }

    // Remove refresh token
    await redis.del(`refresh:${req.user!.id}`)

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Setup MFA
app.post("/api/auth/mfa/setup", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `SureGuard AI (${req.user!.email})`,
      issuer: "SureGuard AI",
    })

    // Store temporary secret
    await redis.setEx(`mfa_setup:${req.user!.id}`, 300, secret.base32) // 5 minutes

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!)

    res.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
    })
  } catch (error) {
    console.error("MFA setup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Verify and enable MFA
app.post("/api/auth/mfa/verify", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: "MFA token required" })
    }

    // Get temporary secret
    const secret = await redis.get(`mfa_setup:${req.user!.id}`)
    if (!secret) {
      return res.status(400).json({ error: "MFA setup session expired" })
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2,
    })

    if (!verified) {
      return res.status(400).json({ error: "Invalid MFA token" })
    }

    // Enable MFA for user
    await pool.query("UPDATE users SET two_factor_enabled = true, two_factor_secret = $1 WHERE id = $2", [
      secret,
      req.user!.id,
    ])

    // Clean up temporary secret
    await redis.del(`mfa_setup:${req.user!.id}`)

    res.json({ message: "MFA enabled successfully" })
  } catch (error) {
    console.error("MFA verification error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Disable MFA
app.post("/api/auth/mfa/disable", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { password, mfaToken } = req.body

    // Verify password
    const userResult = await pool.query("SELECT password_hash, two_factor_secret FROM users WHERE id = $1", [
      req.user!.id,
    ])

    const isValidPassword = await bcrypt.compare(password, userResult.rows[0].password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" })
    }

    // Verify MFA token
    const verified = speakeasy.totp.verify({
      secret: userResult.rows[0].two_factor_secret,
      encoding: "base32",
      token: mfaToken,
      window: 2,
    })

    if (!verified) {
      return res.status(400).json({ error: "Invalid MFA token" })
    }

    // Disable MFA
    await pool.query("UPDATE users SET two_factor_enabled = false, two_factor_secret = NULL WHERE id = $1", [
      req.user!.id,
    ])

    res.json({ message: "MFA disabled successfully" })
  } catch (error) {
    console.error("MFA disable error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user
app.get("/api/auth/me", authenticateToken, (req: AuthRequest, res) => {
  res.json({
    user: {
      id: req.user!.id,
      email: req.user!.email,
      firstName: req.user!.firstName,
      lastName: req.user!.lastName,
      role: req.user!.role,
      twoFactorEnabled: req.user!.twoFactorEnabled,
    },
  })
})

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  await pool.end()
  await redis.quit()
  process.exit(0)
})
