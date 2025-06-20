import { type NextRequest, NextResponse } from "next/server"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "analyst" | "developer"
  status: "active" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  sessions: number
  permissions: string[]
}

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    username: "@elonmusk",
    email: "elon@example.com",
    role: "developer",
    status: "active",
    joinDate: "2022-07-12",
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    sessions: 15,
    permissions: ["read", "analyze"],
  },
  {
    id: "2",
    username: "@jeffbezos",
    email: "jeff@example.com",
    role: "admin",
    status: "suspended",
    joinDate: "2022-06-22",
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    sessions: 8,
    permissions: ["read", "write", "admin", "analyze"],
  },
  {
    id: "3",
    username: "@sundarpichai",
    email: "sundar@example.com",
    role: "admin",
    status: "active",
    joinDate: "2022-05-17",
    lastActive: new Date(Date.now() - 300000).toISOString(),
    sessions: 23,
    permissions: ["read", "write", "admin", "analyze"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredUsers = mockUsers

    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    const users = filteredUsers.slice(0, limit)

    // Calculate summary stats
    const stats = {
      total: mockUsers.length,
      active: mockUsers.filter((u) => u.status === "active").length,
      suspended: mockUsers.filter((u) => u.status === "suspended").length,
      totalSessions: mockUsers.reduce((sum, u) => sum + u.sessions, 0),
      byRole: {
        admin: mockUsers.filter((u) => u.role === "admin").length,
        analyst: mockUsers.filter((u) => u.role === "analyst").length,
        developer: mockUsers.filter((u) => u.role === "developer").length,
      },
    }

    return NextResponse.json({
      users,
      stats,
      total: filteredUsers.length,
      page: 1,
      limit,
    })
  } catch (error) {
    console.error("Users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, userData } = body

    if (action === "create") {
      // Create new user
      if (!userData || !userData.username || !userData.email || !userData.role) {
        return NextResponse.json({ error: "Missing required fields for user creation" }, { status: 400 })
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        status: "pending",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString(),
        sessions: 0,
        permissions: userData.role === "admin" ? ["read", "write", "admin", "analyze"] : ["read"],
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        message: "User created successfully",
      })
    }

    if (action === "update") {
      // Update user status/role
      if (!userId) {
        return NextResponse.json({ error: "Missing userId for update action" }, { status: 400 })
      }

      const validActions = ["suspend", "activate", "promote", "demote"]

      return NextResponse.json({
        success: true,
        message: `User ${userId} updated successfully`,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("User action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
