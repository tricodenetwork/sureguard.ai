"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, Activity, Users, AlertTriangle, TrendingUp } from "lucide-react"
import { RealTimeDeviceAnalysis } from "@/components/dashboard/real-time-device-analysis"
import { GoogleMapsTracker } from "@/components/maps/google-maps-tracker"
import { AIRecommendations } from "@/components/ai/recommendations"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SmoothLink } from "@/components/navigation/smooth-link"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeDevice = async () => {
    if (!searchQuery.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: searchQuery }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SmoothLink href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard</span>
            </SmoothLink>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-green-100 text-green-800">Pro Plan</Badge>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <SmoothLink href="/dashboard/threat-feed" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Threat Feed
              </Button>
            </SmoothLink>
            <SmoothLink href="/device-analysis" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Device Analysis
              </Button>
            </SmoothLink>
            <SmoothLink href="/collaboration" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Team Collaboration
              </Button>
            </SmoothLink>
            <SmoothLink href="/dashboard/settings" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </SmoothLink>
            <SmoothLink href="/upgrade" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </SmoothLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
            <p className="text-gray-600">Real-time threat detection and device analysis</p>
          </div>

          {/* Search Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Analyze Device or IP</CardTitle>
              <CardDescription>
                Enter an IP address, device ID, or user agent to begin real-time analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter IP address, device ID, or user agent..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && analyzeDevice()}
                />
                <Button onClick={analyzeDevice} disabled={isAnalyzing || !searchQuery.trim()}>
                  {isAnalyzing ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4 mr-2" />}
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Analysis Results */}
          <RealTimeDeviceAnalysis analysisResult={analysisResult} isAnalyzing={isAnalyzing} searchQuery={searchQuery} />

          {/* Analysis Tools Grid */}
          {analysisResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Google Maps Tracker */}
              <GoogleMapsTracker ipAddress={searchQuery} deviceId={analysisResult.deviceId} />

              {/* AI Recommendations */}
              <AIRecommendations analysisData={analysisResult} deviceId={analysisResult.deviceId} />
            </div>
          )}

          {/* Dashboard Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">+5% from last hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">8 online now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last week</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
