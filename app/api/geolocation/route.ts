import { type NextRequest, NextResponse } from "next/server"

interface GeoLocation {
  id: string
  ip: string
  country: string
  countryCode: string
  city: string
  region: string
  lat: number
  lng: number
  isp: string
  organization: string
  timezone: string
  threatLevel: "low" | "medium" | "high" | "critical"
  threatCount: number
  isVPN: boolean
  isProxy: boolean
  isTor: boolean
  lastSeen: string
  firstSeen: string
  requestCount: number
}

// Mock geolocation data
const mockLocations: GeoLocation[] = [
  {
    id: "1",
    ip: "203.0.113.1",
    country: "United States",
    countryCode: "US",
    city: "New York",
    region: "New York",
    lat: 40.7128,
    lng: -74.006,
    isp: "Cloudflare Inc.",
    organization: "Cloudflare",
    timezone: "America/New_York",
    threatLevel: "high",
    threatCount: 15,
    isVPN: false,
    isProxy: false,
    isTor: false,
    lastSeen: "2024-01-18T14:30:00Z",
    firstSeen: "2024-01-15T09:20:00Z",
    requestCount: 245,
  },
  {
    id: "2",
    ip: "198.51.100.1",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    region: "England",
    lat: 51.5074,
    lng: -0.1278,
    isp: "British Telecom",
    organization: "BT Group",
    timezone: "Europe/London",
    threatLevel: "medium",
    threatCount: 8,
    isVPN: true,
    isProxy: false,
    isTor: false,
    lastSeen: "2024-01-18T13:15:00Z",
    firstSeen: "2024-01-16T11:30:00Z",
    requestCount: 123,
  },
  {
    id: "3",
    ip: "192.0.2.1",
    country: "Germany",
    countryCode: "DE",
    city: "Berlin",
    region: "Berlin",
    lat: 52.52,
    lng: 13.405,
    isp: "Deutsche Telekom AG",
    organization: "T-Systems",
    timezone: "Europe/Berlin",
    threatLevel: "low",
    threatCount: 3,
    isVPN: false,
    isProxy: true,
    isTor: false,
    lastSeen: "2024-01-18T12:00:00Z",
    firstSeen: "2024-01-17T14:45:00Z",
    requestCount: 67,
  },
  {
    id: "4",
    ip: "203.0.113.100",
    country: "Japan",
    countryCode: "JP",
    city: "Tokyo",
    region: "Tokyo",
    lat: 35.6762,
    lng: 139.6503,
    isp: "NTT Communications",
    organization: "NTT",
    timezone: "Asia/Tokyo",
    threatLevel: "critical",
    threatCount: 25,
    isVPN: false,
    isProxy: false,
    isTor: true,
    lastSeen: "2024-01-18T14:45:00Z",
    firstSeen: "2024-01-14T08:30:00Z",
    requestCount: 456,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const threatLevel = searchParams.get("threat_level")
    const country = searchParams.get("country")
    const isVPN = searchParams.get("is_vpn")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredLocations = mockLocations

    if (threatLevel && threatLevel !== "all") {
      filteredLocations = filteredLocations.filter((location) => location.threatLevel === threatLevel)
    }

    if (country) {
      filteredLocations = filteredLocations.filter(
        (location) =>
          location.country.toLowerCase().includes(country.toLowerCase()) ||
          location.countryCode.toLowerCase() === country.toLowerCase(),
      )
    }

    if (isVPN === "true") {
      filteredLocations = filteredLocations.filter((location) => location.isVPN)
    }

    const locations = filteredLocations.slice(0, limit)

    // Calculate statistics
    const stats = {
      total: mockLocations.length,
      byThreatLevel: {
        critical: mockLocations.filter((l) => l.threatLevel === "critical").length,
        high: mockLocations.filter((l) => l.threatLevel === "high").length,
        medium: mockLocations.filter((l) => l.threatLevel === "medium").length,
        low: mockLocations.filter((l) => l.threatLevel === "low").length,
      },
      byCountry: mockLocations.reduce(
        (acc, location) => {
          acc[location.country] = (acc[location.country] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      vpnCount: mockLocations.filter((l) => l.isVPN).length,
      proxyCount: mockLocations.filter((l) => l.isProxy).length,
      torCount: mockLocations.filter((l) => l.isTor).length,
      totalThreats: mockLocations.reduce((sum, l) => sum + l.threatCount, 0),
    }

    return NextResponse.json({
      locations,
      stats,
      total: filteredLocations.length,
    })
  } catch (error) {
    console.error("Geolocation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ip, action } = body

    if (!ip) {
      return NextResponse.json({ error: "Missing IP address" }, { status: 400 })
    }

    if (action === "lookup") {
      // Simulate IP geolocation lookup
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockResult: GeoLocation = {
        id: Date.now().toString(),
        ip,
        country: "United States",
        countryCode: "US",
        city: "San Francisco",
        region: "California",
        lat: 37.7749 + (Math.random() - 0.5) * 0.1,
        lng: -122.4194 + (Math.random() - 0.5) * 0.1,
        isp: "Example ISP",
        organization: "Example Org",
        timezone: "America/Los_Angeles",
        threatLevel: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
        threatCount: Math.floor(Math.random() * 50),
        isVPN: Math.random() > 0.7,
        isProxy: Math.random() > 0.8,
        isTor: Math.random() > 0.9,
        lastSeen: new Date().toISOString(),
        firstSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        requestCount: Math.floor(Math.random() * 1000),
      }

      return NextResponse.json({
        success: true,
        location: mockResult,
      })
    }

    if (action === "block") {
      return NextResponse.json({
        success: true,
        message: `IP ${ip} has been blocked`,
        timestamp: new Date().toISOString(),
      })
    }

    if (action === "whitelist") {
      return NextResponse.json({
        success: true,
        message: `IP ${ip} has been whitelisted`,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Geolocation action error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
