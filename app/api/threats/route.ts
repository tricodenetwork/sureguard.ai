import { type NextRequest, NextResponse } from "next/server"

interface Threat {
  id: string
  type: string
  riskScore: number
  transactionId: string
  timestamp: string
  location: string
  status: "critical" | "high" | "medium" | "low"
  description: string
  deviceInfo: {
    os: string
    browser: string
    ip: string
  }
}

// Mock threat data
const mockThreats: Threat[] = [
  {
    id: "1",
    type: "Carding",
    riskScore: 90,
    transactionId: "1234567890",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    location: "Unknown",
    status: "critical",
    description: "Multiple failed payment attempts detected from suspicious IP",
    deviceInfo: {
      os: "Windows 10",
      browser: "Chrome 119.0",
      ip: "192.168.1.100",
    },
  },
  {
    id: "2",
    type: "Account takeover",
    riskScore: 80,
    transactionId: "1234567891",
    timestamp: new Date(Date.now() - 360000).toISOString(),
    location: "New York, US",
    status: "high",
    description: "Login attempt from new device with stolen credentials",
    deviceInfo: {
      os: "macOS 14",
      browser: "Safari 17.0",
      ip: "203.0.113.1",
    },
  },
  {
    id: "3",
    type: "Identity theft",
    riskScore: 70,
    transactionId: "1234567892",
    timestamp: new Date(Date.now() - 540000).toISOString(),
    location: "London, UK",
    status: "medium",
    description: "Personal information mismatch in verification process",
    deviceInfo: {
      os: "Android 14",
      browser: "Chrome Mobile 119.0",
      ip: "198.51.100.1",
    },
  },
  {
    id: "4",
    type: "Phishing",
    riskScore: 60,
    transactionId: "1234567893",
    timestamp: new Date(Date.now() - 720000).toISOString(),
    location: "Tokyo, JP",
    status: "medium",
    description: "User clicked on suspicious email link",
    deviceInfo: {
      os: "iOS 17",
      browser: "Safari Mobile 17.0",
      ip: "203.0.113.100",
    },
  },
  {
    id: "5",
    type: "Malware",
    riskScore: 50,
    transactionId: "1234567894",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    location: "Berlin, DE",
    status: "low",
    description: "Potential malware signature detected in user session",
    deviceInfo: {
      os: "Linux Ubuntu",
      browser: "Firefox 120.0",
      ip: "198.51.100.200",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredThreats = mockThreats

    if (status && status !== "all") {
      filteredThreats = mockThreats.filter((threat) => threat.status === status)
    }

    const threats = filteredThreats.slice(0, limit)

    return NextResponse.json({
      threats,
      total: filteredThreats.length,
      page: 1,
      limit,
    })
  } catch (error) {
    console.error("Threats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, threatId } = body

    if (!action || !threatId) {
      return NextResponse.json({ error: "Missing required fields: action and threatId" }, { status: 400 })
    }

    // Mock action processing
    const validActions = ["block", "investigate", "resolve", "escalate"]

    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Invalid action. Must be one of: " + validActions.join(", ") }, { status: 400 })
    }

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `Threat ${threatId} has been ${action}ed successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Threat action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
