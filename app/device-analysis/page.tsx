"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Search, Monitor, MapPin, Clock, AlertTriangle, Activity } from "lucide-react"
import { DeviceCard } from "@/components/micro/device-card"
import { GeoMap } from "@/components/micro/geo-map"

interface DeviceAnalysis {
  id: string
  fingerprint: string
  type: "desktop" | "mobile" | "tablet"
  os: string
  browser: string
  screen: string
  timezone: string
  language: string
  riskScore: number
  isActive: boolean
  location: {
    country: string
    city: string
    lat: number
    lng: number
  }
  sessions: {
    id: string
    timestamp: string
    duration: string
    actions: number
    suspicious: boolean
  }[]
  threats: {
    type: string
    severity: "low" | "medium" | "high" | "critical"
    timestamp: string
    description: string
  }[]
}

export default function DeviceAnalysis() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDevice, setSelectedDevice] = useState<DeviceAnalysis | null>(null)
  const [devices, setDevices] = useState<DeviceAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const analyzeDevice = async (input: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockDevice: DeviceAnalysis = {
        id: Date.now().toString(),
        fingerprint: "a1b2c3d4e5f6g7h8",
        type: "desktop",
        os: "Windows 11 Pro",
        browser: "Chrome 120.0.6099.109",
        screen: "1920x1080",
        timezone: "America/New_York",
        language: "en-US",
        riskScore: Math.floor(Math.random() * 100),
        isActive: true,
        location: {
          country: "United States",
          city: "New York",
          lat: 40.7128,
          lng: -74.006,
        },
        sessions: [
          {
            id: "1",
            timestamp: "2024-01-18 14:30:00",
            duration: "45 mins",
            actions: 23,
            suspicious: false,
          },
          {
            id: "2",
            timestamp: "2024-01-18 10:15:00",
            duration: "1h 20m",
            actions: 67,
            suspicious: true,
          },
          {
            id: "3",
            timestamp: "2024-01-17 16:45:00",
            duration: "30 mins",
            actions: 15,
            suspicious: false,
          },
        ],
        threats: [
          {
            type: "Suspicious Login Pattern",
            severity: "medium",
            timestamp: "2024-01-18 10:15:00",
            description: "Multiple failed login attempts detected",
          },
          {
            type: "Unusual Geolocation",
            severity: "high",
            timestamp: "2024-01-17 22:30:00",
            description: "Login from unexpected location",
          },
        ],
      }

      setSelectedDevice(mockDevice)
      setDevices((prev) => [mockDevice, ...prev.slice(0, 4)])
    } catch (error) {
      console.error("Device analysis failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      analyzeDevice(searchQuery)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Threat Feed
            </Button>
            <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
              <Monitor className="mr-2 h-4 w-4" />
              Device Analysis
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              API Monitoring
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Device Analysis</h1>
            <p className="text-gray-600">Analyze device fingerprints, track behavior, and detect anomalies</p>
          </div>

          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Analyze Device</CardTitle>
              <CardDescription>Enter an IP address, device ID, or user agent to begin analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter IP, device ID, or user agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? <Activity className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {selectedDevice && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Device Overview */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5" />
                    <span>Device Overview</span>
                    <Badge
                      className={
                        selectedDevice.riskScore > 70 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }
                    >
                      Risk: {selectedDevice.riskScore}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="sessions">Sessions</TabsTrigger>
                      <TabsTrigger value="threats">Threats</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Device Type</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <Monitor className="h-4 w-4" />
                              <span className="capitalize">{selectedDevice.type}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Operating System</label>
                            <p className="mt-1">{selectedDevice.os}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Browser</label>
                            <p className="mt-1">{selectedDevice.browser}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Screen Resolution</label>
                            <p className="mt-1">{selectedDevice.screen}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Fingerprint</label>
                            <p className="mt-1 font-mono text-sm">{selectedDevice.fingerprint}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Timezone</label>
                            <p className="mt-1">{selectedDevice.timezone}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Language</label>
                            <p className="mt-1">{selectedDevice.language}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Location</label>
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {selectedDevice.location.city}, {selectedDevice.location.country}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sessions" className="space-y-4">
                      {selectedDevice.sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{session.timestamp}</div>
                              <div className="text-sm text-gray-500">
                                Duration: {session.duration} • {session.actions} actions
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.suspicious && <Badge className="bg-red-100 text-red-800">Suspicious</Badge>}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="threats" className="space-y-4">
                      {selectedDevice.threats.map((threat, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <div className="font-medium">{threat.type}</div>
                              <div className="text-sm text-gray-500">{threat.description}</div>
                              <div className="text-xs text-gray-400">{threat.timestamp}</div>
                            </div>
                          </div>
                          <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Location Map */}
              <GeoMap />
            </div>
          )}

          {/* Recent Analyses */}
          {devices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Device Analyses</CardTitle>
                <CardDescription>Previously analyzed devices and their risk profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map((device) => (
                    <DeviceCard
                      key={device.id}
                      device={{
                        id: device.id,
                        type: device.type,
                        os: device.os,
                        browser: device.browser,
                        location: `${device.location.city}, ${device.location.country}`,
                        lastSeen: "Just analyzed",
                        riskScore: device.riskScore,
                        isActive: device.isActive,
                        fingerprint: device.fingerprint,
                      }}
                      onTrack={(id) => console.log("Track device:", id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
