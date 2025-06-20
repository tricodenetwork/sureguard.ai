import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { createClient } from "redis"
import axios from "axios"
import { Pool } from "pg"
import { z } from "zod"
import type { Request, Response, NextFunction } from "express"
import geoip from "geoip-lite"
import dns from "dns"
import { promisify } from "util"

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

// DNS lookup promisified
const dnsLookup = promisify(dns.lookup)
const dnsReverse = promisify(dns.reverse)

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
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Validation schemas
const threatAnalysisSchema = z.object({
  input_value: z.string().min(1),
  input_type: z.enum(["ip", "url", "email", "domain", "hash"]),
  context: z.record(z.any()).optional(),
  user_agent: z.string().optional(),
  session_data: z.record(z.any()).optional(),
  device_fingerprint: z.record(z.any()).optional(),
})

const batchAnalysisSchema = z.object({
  requests: z.array(threatAnalysisSchema).max(100),
})

// Types
interface ThreatAnalysisRequest {
  input_value: string
  input_type: "ip" | "url" | "email" | "domain" | "hash"
  context?: Record<string, any>
  user_agent?: string
  session_data?: Record<string, any>
  device_fingerprint?: Record<string, any>
}

interface ThreatAnalysisResponse {
  id: string
  input_value: string
  input_type: string
  risk_score: number
  confidence_score: number
  threat_type: string
  severity: "low" | "medium" | "high" | "critical"
  status: "active" | "resolved" | "investigating"
  location?: {
    country?: string
    city?: string
    lat?: number
    lng?: number
  }
  ai_analysis: Record<string, any>
  device_fingerprint?: Record<string, any>
  session_data?: Record<string, any>
  created_at: string
  processing_time_ms: number
}

// Utility functions
const generateId = () => {
  return "threat_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

const getGeolocation = (ip: string) => {
  try {
    const geo = geoip.lookup(ip)
    if (geo) {
      return {
        country: geo.country,
        city: geo.city,
        lat: geo.ll[0],
        lng: geo.ll[1],
      }
    }
  } catch (error) {
    console.error("Geolocation error:", error)
  }
  return null
}

// Third-party API integrations
const checkVirusTotal = async (input: string, type: string): Promise<any> => {
  try {
    const apiKey = process.env.VIRUSTOTAL_API_KEY
    if (!apiKey) return null

    let endpoint = ""
    let params: any = {}

    switch (type) {
      case "ip":
        endpoint = `https://www.virustotal.com/vtapi/v2/ip-address/report`
        params = { apikey: apiKey, ip: input }
        break
      case "url":
        endpoint = `https://www.virustotal.com/vtapi/v2/url/report`
        params = { apikey: apiKey, resource: input }
        break
      case "domain":
        endpoint = `https://www.virustotal.com/vtapi/v2/domain/report`
        params = { apikey: apiKey, domain: input }
        break
      case "hash":
        endpoint = `https://www.virustotal.com/vtapi/v2/file/report`
        params = { apikey: apiKey, resource: input }
        break
      default:
        return null
    }

    const response = await axios.get(endpoint, { params, timeout: 5000 })
    return response.data
  } catch (error) {
    console.error("VirusTotal API error:", error)
    return null
  }
}

const checkShodan = async (ip: string): Promise<any> => {
  try {
    const apiKey = process.env.SHODAN_API_KEY
    if (!apiKey) return null

    const response = await axios.get(`https://api.shodan.io/shodan/host/${ip}`, {
      params: { key: apiKey },
      timeout: 5000,
    })
    return response.data
  } catch (error) {
    console.error("Shodan API error:", error)
    return null
  }
}

const checkAbuseIPDB = async (ip: string): Promise<any> => {
  try {
    const apiKey = process.env.ABUSEIPDB_API_KEY
    if (!apiKey) return null

    const response = await axios.get("https://api.abuseipdb.com/api/v2/check", {
      headers: {
        Key: apiKey,
        Accept: "application/json",
      },
      params: {
        ipAddress: ip,
        maxAgeInDays: 90,
        verbose: true,
      },
      timeout: 5000,
    })
    return response.data
  } catch (error) {
    console.error("AbuseIPDB API error:", error)
    return null
  }
}

// DNS analysis
const performDNSAnalysis = async (domain: string): Promise<any> => {
  try {
    const results: any = {}

    // A record lookup
    try {
      const aRecords = await dnsLookup(domain, { family: 4 })
      results.a_records = Array.isArray(aRecords) ? aRecords : [aRecords]
    } catch (error) {
      results.a_records = []
    }

    // MX record lookup
    try {
      const mxRecords = await promisify(dns.resolveMx)(domain)
      results.mx_records = mxRecords
    } catch (error) {
      results.mx_records = []
    }

    // TXT record lookup
    try {
      const txtRecords = await promisify(dns.resolveTxt)(domain)
      results.txt_records = txtRecords
    } catch (error) {
      results.txt_records = []
    }

    // Reverse DNS lookup for A records
    if (results.a_records.length > 0) {
      try {
        const reverseResults = await Promise.allSettled(
          results.a_records.map((record: any) => dnsReverse(record.address || record)),
        )
        results.reverse_dns = reverseResults.map((result, index) => ({
          ip: results.a_records[index].address || results.a_records[index],
          hostnames: result.status === "fulfilled" ? result.value : [],
        }))
      } catch (error) {
        results.reverse_dns = []
      }
    }

    return results
  } catch (error) {
    console.error("DNS analysis error:", error)
    return {}
  }
}

// ML Service integration
const callMLService = async (request: ThreatAnalysisRequest): Promise<any> => {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8080"
    const response = await axios.post(`${mlServiceUrl}/api/analyze`, request, {
      timeout: 10000,
    })
    return response.data
  } catch (error) {
    console.error("ML Service error:", error)
    return {
      risk_score: 50,
      confidence_score: 0,
      threat_type: "ml_service_error",
      severity: "unknown",
      explanation: "ML service unavailable",
      recommendations: ["Manual review required"],
      model_predictions: {},
      processing_time_ms: 0,
    }
  }
}

// Main threat analysis function
const analyzeThreat = async (request: ThreatAnalysisRequest): Promise<ThreatAnalysisResponse> => {
  const startTime = Date.now()
  const threatId = generateId()

  try {
    // Get ML analysis
    const mlAnalysis = await callMLService(request)

    // Get geolocation for IP addresses
    let location = null
    if (request.input_type === "ip") {
      location = getGeolocation(request.input_value)
    } else if (request.input_type === "domain" || request.input_type === "url") {
      // Extract domain from URL
      let domain = request.input_value
      if (request.input_type === "url") {
        try {
          const url = new URL(request.input_value)
          domain = url.hostname
        } catch (error) {
          console.error("URL parsing error:", error)
        }
      }

      // Get IP for domain and then geolocation
      try {
        const dnsResult = await dnsLookup(domain, { family: 4 })
        const ip = Array.isArray(dnsResult) ? dnsResult[0].address : dnsResult.address
        location = getGeolocation(ip)
      } catch (error) {
        console.error("DNS lookup error:", error)
      }
    }

    // Gather threat intelligence from multiple sources
    const threatIntelligence: any = {}

    // VirusTotal check
    const vtResult = await checkVirusTotal(request.input_value, request.input_type)
    if (vtResult) {
      threatIntelligence.virustotal = vtResult
    }

    // Shodan check for IPs
    if (request.input_type === "ip") {
      const shodanResult = await checkShodan(request.input_value)
      if (shodanResult) {
        threatIntelligence.shodan = shodanResult
      }

      // AbuseIPDB check
      const abuseResult = await checkAbuseIPDB(request.input_value)
      if (abuseResult) {
        threatIntelligence.abuseipdb = abuseResult
      }
    }

    // DNS analysis for domains
    if (request.input_type === "domain" || request.input_type === "url") {
      let domain = request.input_value
      if (request.input_type === "url") {
        try {
          const url = new URL(request.input_value)
          domain = url.hostname
        } catch (error) {
          console.error("URL parsing error:", error)
        }
      }
      const dnsAnalysis = await performDNSAnalysis(domain)
      threatIntelligence.dns = dnsAnalysis
    }

    // Combine ML analysis with threat intelligence
    let finalRiskScore = mlAnalysis.risk_score
    let finalConfidence = mlAnalysis.confidence_score
    let threatType = mlAnalysis.threat_type
    let severity = mlAnalysis.severity

    // Adjust scores based on threat intelligence
    if (threatIntelligence.virustotal) {
      const vt = threatIntelligence.virustotal
      if (vt.positives && vt.total) {
        const vtScore = (vt.positives / vt.total) * 100
        finalRiskScore = Math.max(finalRiskScore, vtScore)
        finalConfidence = Math.min(100, finalConfidence + 20)
      }
    }

    if (threatIntelligence.abuseipdb && threatIntelligence.abuseipdb.data) {
      const abuse = threatIntelligence.abuseipdb.data
      if (abuse.abuseConfidencePercentage > 0) {
        finalRiskScore = Math.max(finalRiskScore, abuse.abuseConfidencePercentage)
        finalConfidence = Math.min(100, finalConfidence + 15)
        if (abuse.abuseConfidencePercentage > 75) {
          threatType = "known_malicious_ip"
          severity = "critical"
        }
      }
    }

    // Determine final severity
    if (finalRiskScore >= 80) {
      severity = "critical"
    } else if (finalRiskScore >= 60) {
      severity = "high"
    } else if (finalRiskScore >= 40) {
      severity = "medium"
    } else {
      severity = "low"
    }

    const processingTime = Date.now() - startTime

    const result: ThreatAnalysisResponse = {
      id: threatId,
      input_value: request.input_value,
      input_type: request.input_type,
      risk_score: Math.round(finalRiskScore),
      confidence_score: Math.round(finalConfidence),
      threat_type: threatType,
      severity,
      status: "active",
      location,
      ai_analysis: {
        ml_analysis: mlAnalysis,
        threat_intelligence: threatIntelligence,
      },
      device_fingerprint: request.device_fingerprint,
      session_data: request.session_data,
      created_at: new Date().toISOString(),
      processing_time_ms: processingTime,
    }

    // Store in database
    await pool.query(
      `INSERT INTO threat_detections (
        id, input_value, input_type, risk_score, confidence_score, 
        threat_type, severity, status, location_country, location_city, 
        location_lat, location_lng, ai_analysis, device_fingerprint, 
        session_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        result.id,
        result.input_value,
        result.input_type,
        result.risk_score,
        result.confidence_score,
        result.threat_type,
        result.severity,
        result.status,
        result.location?.country,
        result.location?.city,
        result.location?.lat,
        result.location?.lng,
        JSON.stringify(result.ai_analysis),
        JSON.stringify(result.device_fingerprint),
        JSON.stringify(result.session_data),
        result.created_at,
      ],
    )

    // Cache result
    await redis.setEx(`threat:${threatId}`, 3600, JSON.stringify(result))

    return result
  } catch (error) {
    console.error("Threat analysis error:", error)
    const processingTime = Date.now() - startTime

    return {
      id: threatId,
      input_value: request.input_value,
      input_type: request.input_type,
      risk_score: 50,
      confidence_score: 0,
      threat_type: "analysis_error",
      severity: "medium",
      status: "investigating",
      ai_analysis: { error: error.message },
      created_at: new Date().toISOString(),
      processing_time_ms: processingTime,
    }
  }
}

// Routes

// Health check
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1")
    await redis.ping()
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      redis: "connected",
    })
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message,
    })
  }
})

// Analyze single threat
app.post("/api/threats/analyze", async (req, res) => {
  try {
    const request = threatAnalysisSchema.parse(req.body)
    const result = await analyzeThreat(request)
    res.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors })
    }
    res.status(500).json({ error: "Internal server error" })
  }
})

// Batch analysis
app.post("/api/threats/analyze/batch", async (req, res) => {
  try {
    const { requests } = batchAnalysisSchema.parse(req.body)

    const results = await Promise.allSettled(requests.map((request) => analyzeThreat(request)))

    const processedResults = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          error: result.reason.message,
          request_index: index,
        }
      }
    })

    res.json({
      results: processedResults,
      total_processed: processedResults.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Batch analysis error:", error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors })
    }
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get threat by ID
app.get("/api/threats/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Check cache first
    const cached = await redis.get(`threat:${id}`)
    if (cached) {
      return res.json(JSON.parse(cached))
    }

    // Query database
    const result = await pool.query(`SELECT * FROM threat_detections WHERE id = $1`, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Threat not found" })
    }

    const threat = result.rows[0]
    const response = {
      id: threat.id,
      input_value: threat.input_value,
      input_type: threat.input_type,
      risk_score: threat.risk_score,
      confidence_score: threat.confidence_score,
      threat_type: threat.threat_type,
      severity: threat.severity,
      status: threat.status,
      location: threat.location_country
        ? {
            country: threat.location_country,
            city: threat.location_city,
            lat: threat.location_lat,
            lng: threat.location_lng,
          }
        : null,
      ai_analysis: threat.ai_analysis,
      device_fingerprint: threat.device_fingerprint,
      session_data: threat.session_data,
      created_at: threat.created_at,
      updated_at: threat.updated_at,
    }

    // Cache for future requests
    await redis.setEx(`threat:${id}`, 3600, JSON.stringify(response))

    res.json(response)
  } catch (error) {
    console.error("Get threat error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// List threats with pagination and filtering
app.get("/api/threats", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Math.min(Number.parseInt(req.query.limit as string) || 20, 100)
    const offset = (page - 1) * limit

    const severity = req.query.severity as string
    const status = req.query.status as string
    const input_type = req.query.input_type as string
    const from_date = req.query.from_date as string
    const to_date = req.query.to_date as string

    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (severity) {
      whereClause += ` AND severity = $${paramIndex}`
      params.push(severity)
      paramIndex++
    }

    if (status) {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (input_type) {
      whereClause += ` AND input_type = $${paramIndex}`
      params.push(input_type)
      paramIndex++
    }

    if (from_date) {
      whereClause += ` AND created_at >= $${paramIndex}`
      params.push(from_date)
      paramIndex++
    }

    if (to_date) {
      whereClause += ` AND created_at <= $${paramIndex}`
      params.push(to_date)
      paramIndex++
    }

    // Get total count
    const countResult = await pool.query(`SELECT COUNT(*) FROM threat_detections ${whereClause}`, params)
    const totalCount = Number.parseInt(countResult.rows[0].count)

    // Get threats
    const result = await pool.query(
      `SELECT id, input_value, input_type, risk_score, confidence_score, 
              threat_type, severity, status, location_country, location_city,
              created_at, updated_at
       FROM threat_detections 
       ${whereClause}
       ORDER BY created_at DESC 
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset],
    )

    const threats = result.rows.map((row) => ({
      id: row.id,
      input_value: row.input_value,
      input_type: row.input_type,
      risk_score: row.risk_score,
      confidence_score: row.confidence_score,
      threat_type: row.threat_type,
      severity: row.severity,
      status: row.status,
      location: row.location_country
        ? {
            country: row.location_country,
            city: row.location_city,
          }
        : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    res.json({
      threats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("List threats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Update threat status
app.put("/api/threats/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const { status, resolved_by } = req.body

    if (!["active", "resolved", "investigating"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const updateFields = ["status = $2", "updated_at = NOW()"]
    const params = [id, status]
    let paramIndex = 3

    if (status === "resolved" && resolved_by) {
      updateFields.push(`resolved_at = NOW()`, `resolved_by = $${paramIndex}`)
      params.push(resolved_by)
      paramIndex++
    }

    const result = await pool.query(
      `UPDATE threat_detections 
       SET ${updateFields.join(", ")}
       WHERE id = $1 
       RETURNING *`,
      params,
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Threat not found" })
    }

    // Invalidate cache
    await redis.del(`threat:${id}`)

    res.json({ message: "Threat status updated successfully" })
  } catch (error) {
    console.error("Update threat status error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get threat statistics
app.get("/api/threats/stats", async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_threats,
        COUNT(*) FILTER (WHERE severity = 'critical') as critical_threats,
        COUNT(*) FILTER (WHERE severity = 'high') as high_threats,
        COUNT(*) FILTER (WHERE severity = 'medium') as medium_threats,
        COUNT(*) FILTER (WHERE severity = 'low') as low_threats,
        COUNT(*) FILTER (WHERE status = 'active') as active_threats,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_threats,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as threats_24h,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as threats_7d,
        AVG(risk_score) as avg_risk_score,
        AVG(processing_time_ms) as avg_processing_time
      FROM threat_detections
    `)

    const topThreatTypes = await pool.query(`
      SELECT threat_type, COUNT(*) as count
      FROM threat_detections
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY threat_type
      ORDER BY count DESC
      LIMIT 10
    `)

    const topCountries = await pool.query(`
      SELECT location_country, COUNT(*) as count
      FROM threat_detections
      WHERE location_country IS NOT NULL
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY location_country
      ORDER BY count DESC
      LIMIT 10
    `)

    res.json({
      overview: stats.rows[0],
      top_threat_types: topThreatTypes.rows,
      top_countries: topCountries.rows,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Threat Detection service running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully")
  await pool.end()
  await redis.quit()
  process.exit(0)
})
