import { type NextRequest, NextResponse } from "next/server"

interface DeviceFingerprint {
  id: string
  fingerprint: string
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  platform: string
  browser: string
  os: string
  deviceType: "desktop" | "mobile" | "tablet"
  isSuspicious: boolean
  riskScore: number
  firstSeen: string
  lastSeen: string
  seenCount: number
  associatedIPs: string[]
  location: {
    country: string
    city: string
    lat: number
    lng: number
  }
  sessions: {
    id: string
    timestamp: string
    duration: number
    actions: number
    suspicious: boolean
  }[]
}

// Mock device data
const mockDevices: DeviceFingerprint[] = [
  {
    id: "1",
    fingerprint: "a1b2c3d4e5f6g7h8",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    screenResolution: "1920x1080",
    timezone: "America/New_York",
    language: "en-US",
    platform: "Win32",
    browser: "Chrome 120.0",
    os: "Windows 11",
    deviceType: "desktop",
    isSuspicious: false,
    riskScore: 25,
    firstSeen: "2024-01-15T10:30:00Z",
    lastSeen: "2024-01-18T14:30:00Z",
    seenCount: 15,
    associatedIPs: ["192.168.1.100", "203.0.113.1"],
    location: {
      country: "United States",
      city: "New York",
      lat: 40.7128,
      lng: -74.006,
    },
    sessions: [
      {
        id: "s1",
        timestamp: "2024-01-18T14:30:00Z",
        duration: 2700, // 45 minutes
        actions: 23,
        suspicious: false,
      },
      {
        id: "s2",
        timestamp: "2024-01-18T10:15:00Z",
        duration: 4800, // 1h 20m
        actions: 67,
        suspicious: true,
      },
    ],
  },
  {
    id: "2",
    fingerprint: "f6e5d4c3b2a1z9y8",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15",
    screenResolution: "390x844",
    timezone: "Europe/London",
    language: "en-GB",
    platform: "iPhone",
    browser: "Safari 17.0",
    os: "iOS 17.2",
    deviceType: "mobile",
    isSuspicious: true,
    riskScore: 75,
    firstSeen: "2024-01-17T08:15:00Z",
    lastSeen: "2024-01-18T12:45:00Z",
    seenCount: 8,
    associatedIPs: ["198.51.100.1", "203.0.113.50"],
    location: {
      country: "United Kingdom",
      city: "London",
      lat: 51.5074,
      lng: -0.1278,
    },
    sessions: [
      {
        id: "s3",
        timestamp: "2024-01-18T12:45:00Z",
        duration: 1800, // 30 minutes
        actions: 45,
        suspicious: true,
      },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceType = searchParams.get("type")
    const suspicious = searchParams.get("suspicious")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredDevices = mockDevices

    if (deviceType && deviceType !== "all") {
      filteredDevices = filteredDevices.filter((device) => device.deviceType === deviceType)
    }

    if (suspicious === "true") {
      filteredDevices = filteredDevices.filter((device) => device.isSuspicious)
    }

    const devices = filteredDevices.slice(0, limit)

    return NextResponse.json({
      devices,
      total: filteredDevices.length,
      stats: {
        total: mockDevices.length,
        suspicious: mockDevices.filter((d) => d.isSuspicious).length,
        byType: {
          desktop: mockDevices.filter((d) => d.deviceType === "desktop").length,
          mobile: mockDevices.filter((d) => d.deviceType === "mobile").length,
          tablet: mockDevices.filter((d) => d.deviceType === "tablet").length,
        },
      },
    })
  } catch (error) {
    console.error("Devices API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, deviceId, fingerprint } = body

    if (action === "analyze") {
      if (!fingerprint && !deviceId) {
        return NextResponse.json({ error: "Missing fingerprint or deviceId for analysis" }, { status: 400 })
      }

      // Simulate device analysis
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const analysisResult = {
        deviceId: deviceId || Date.now().toString(),
        fingerprint: fingerprint || "generated_fingerprint_" + Date.now(),
        riskScore: Math.floor(Math.random() * 100),
        threats: [
          "Unusual login pattern detected",
          "Device fingerprint mismatch",
          "Suspicious geolocation change",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        recommendations: [
          "Monitor device activity closely",
          "Require additional authentication",
          "Block suspicious sessions",
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        confidence: 85 + Math.floor(Math.random() * 15),
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
      })
    }

    if (action === "track") {
      if (!deviceId) {
        return NextResponse.json({ error: "Missing deviceId for tracking" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: `Device ${deviceId} is now being tracked`,
        trackingId: `track_${Date.now()}`,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Device action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
