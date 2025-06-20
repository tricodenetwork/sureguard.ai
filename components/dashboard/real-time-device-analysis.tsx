"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Monitor, Shield, MapPin, Clock, AlertTriangle, Activity, Wifi, Smartphone, Tablet, Laptop } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface RealTimeDeviceAnalysisProps {
  analysisResult: any
  isAnalyzing: boolean
  searchQuery: string
}

const riskColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"]
const deviceTypeIcons = {
  desktop: Laptop,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Monitor,
}

export function RealTimeDeviceAnalysis({ analysisResult, isAnalyzing, searchQuery }: RealTimeDeviceAnalysisProps) {
  const [realTimeData, setRealTimeData] = useState<any[]>([])
  const [deviceMetrics, setDeviceMetrics] = useState({
    totalDevices: 0,
    activeDevices: 0,
    riskScore: 0,
    threats: 0,
  })

  useEffect(() => {
    if (analysisResult) {
      // Simulate real-time data updates
      const interval = setInterval(() => {
        const newDataPoint = {
          time: new Date().toLocaleTimeString(),
          riskScore: Math.floor(Math.random() * 100),
          activity: Math.floor(Math.random() * 50) + 10,
          threats: Math.floor(Math.random() * 5),
        }

        setRealTimeData((prev) => [...prev.slice(-9), newDataPoint])

        setDeviceMetrics((prev) => ({
          ...prev,
          riskScore: newDataPoint.riskScore,
          threats: prev.threats + newDataPoint.threats,
        }))
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [analysisResult])

  if (isAnalyzing) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-orange-600 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900">Analyzing Device...</h3>
              <p className="text-orange-700">Processing: {searchQuery}</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={75} className="h-2" />
            <p className="text-sm text-orange-600 mt-2">Running AI analysis and threat detection...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysisResult) return null

  const DeviceIcon =
    deviceTypeIcons[analysisResult.deviceFingerprint?.device?.toLowerCase() as keyof typeof deviceTypeIcons] || Monitor

  const pieData = [
    { name: "Safe", value: 100 - analysisResult.riskScore, color: "#22c55e" },
    { name: "Risk", value: analysisResult.riskScore, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DeviceIcon className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-blue-900">Real-time Device Analysis</CardTitle>
                <CardDescription className="text-blue-700">
                  Analyzing: {searchQuery} • Live monitoring active
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Badge variant={analysisResult.riskScore > 70 ? "destructive" : "secondary"}>
                Risk: {analysisResult.riskScore}%
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-time Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Device Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-500">Type</label>
                <p className="capitalize">{analysisResult.deviceFingerprint?.device || "Unknown"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">OS</label>
                <p>{analysisResult.deviceFingerprint?.os || "Unknown"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Browser</label>
                <p>{analysisResult.deviceFingerprint?.browser || "Unknown"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Screen</label>
                <p>{analysisResult.deviceFingerprint?.screen || "Unknown"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Timezone</label>
                <p>{analysisResult.deviceFingerprint?.timezone || "Unknown"}</p>
              </div>
              <div>
                <label className="font-medium text-gray-500">Language</label>
                <p>{analysisResult.deviceFingerprint?.language || "Unknown"}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="text-sm">
                {analysisResult.location?.city}, {analysisResult.location?.country}
              </p>
              <p className="text-xs text-gray-500">
                {analysisResult.location?.lat}, {analysisResult.location?.lng}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <PieChart width={128} height={128}>
                  <Pie
                    data={pieData}
                    cx={64}
                    cy={64}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{analysisResult.riskScore}%</div>
                    <div className="text-xs text-gray-500">Risk</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span>{analysisResult.confidence}%</span>
              </div>
              <Progress value={analysisResult.confidence} className="h-2" />
            </div>

            <div className="space-y-2">
              {analysisResult.threats?.slice(0, 3).map((threat: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span>{threat}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Live Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {realTimeData.length > 0 && (
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realTimeData}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip />
                    <Line type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">Active Sessions</div>
                <div className="text-lg font-bold">{deviceMetrics.activeDevices || 1}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium text-gray-500">Threats Detected</div>
                <div className="text-lg font-bold text-red-600">{deviceMetrics.threats}</div>
              </div>
            </div>

            <div className="space-y-2">
              {analysisResult.sessionHistory?.slice(0, 3).map((session: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{session.location}</span>
                  </div>
                  <Badge variant={session.success ? "secondary" : "destructive"} className="text-xs">
                    {session.success ? "Success" : "Failed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Recommendations</CardTitle>
          <CardDescription>Automated security recommendations based on analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.recommendations?.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{recommendation}</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs">
                    Apply Action
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
