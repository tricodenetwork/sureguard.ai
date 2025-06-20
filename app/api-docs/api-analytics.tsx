"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Globe,
  Smartphone,
  Shield,
} from "lucide-react"

interface AnalyticsData {
  requests: {
    total: number
    successful: number
    failed: number
    trend: number
  }
  performance: {
    avgResponseTime: number
    p95ResponseTime: number
    uptime: number
    errorRate: number
  }
  usage: {
    topEndpoints: Array<{ path: string; count: number; percentage: number }>
    geographicDistribution: Array<{ country: string; requests: number; percentage: number }>
    deviceTypes: Array<{ type: string; count: number; percentage: number }>
  }
  threats: {
    detected: number
    blocked: number
    riskDistribution: Array<{ level: string; count: number; color: string }>
  }
}

export function APIAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    requests: {
      total: 245670,
      successful: 244892,
      failed: 778,
      trend: 12.5,
    },
    performance: {
      avgResponseTime: 145,
      p95ResponseTime: 320,
      uptime: 99.9,
      errorRate: 0.3,
    },
    usage: {
      topEndpoints: [
        { path: "/api/analyze", count: 125430, percentage: 51 },
        { path: "/api/threats", count: 67890, percentage: 28 },
        { path: "/api/device/analyze", count: 34560, percentage: 14 },
        { path: "/api/ai/insights", count: 17790, percentage: 7 },
      ],
      geographicDistribution: [
        { country: "United States", requests: 98268, percentage: 40 },
        { country: "United Kingdom", requests: 49134, percentage: 20 },
        { country: "Germany", requests: 36701, percentage: 15 },
        { country: "Canada", requests: 24567, percentage: 10 },
        { country: "Others", requests: 36700, percentage: 15 },
      ],
      deviceTypes: [
        { type: "Desktop", count: 147402, percentage: 60 },
        { type: "Mobile", count: 73701, percentage: 30 },
        { type: "Tablet", count: 24567, percentage: 10 },
      ],
    },
    threats: {
      detected: 12470,
      blocked: 11893,
      riskDistribution: [
        { level: "Critical", count: 1247, color: "bg-red-500" },
        { level: "High", count: 3741, color: "bg-orange-500" },
        { level: "Medium", count: 4988, color: "bg-yellow-500" },
        { level: "Low", count: 2494, color: "bg-green-500" },
      ],
    },
  })

  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{analyticsData.requests.total.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{analyticsData.requests.trend}%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">
                  {((analyticsData.requests.successful / analyticsData.requests.total) * 100).toFixed(1)}%
                </p>
                <Progress
                  value={(analyticsData.requests.successful / analyticsData.requests.total) * 100}
                  className="mt-2 h-2"
                />
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{analyticsData.performance.avgResponseTime}ms</p>
                <p className="text-sm text-gray-500">P95: {analyticsData.performance.p95ResponseTime}ms</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threats Blocked</p>
                <p className="text-2xl font-bold">{analyticsData.threats.blocked.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{analyticsData.threats.detected.toLocaleString()} detected</p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={timeRange} onValueChange={setTimeRange} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detailed Analytics</h3>
          <TabsList>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Top Endpoints</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.usage.topEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <span className="text-sm text-gray-600">{endpoint.count.toLocaleString()}</span>
                      </div>
                      <Progress value={endpoint.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Geographic Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.usage.geographicDistribution.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{country.country}</span>
                        <span className="text-sm text-gray-600">{country.requests.toLocaleString()}</span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Device Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.usage.deviceTypes.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{device.type}</span>
                        <span className="text-sm text-gray-600">{device.count.toLocaleString()}</span>
                      </div>
                      <Progress value={device.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threat Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Threat Risk Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.threats.riskDistribution.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                      <span className="text-sm font-medium">{risk.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{risk.count.toLocaleString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {((risk.count / analyticsData.threats.detected) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">{analyticsData.performance.uptime}%</div>
              <div className="text-sm text-gray-600">Uptime</div>
              <Progress value={analyticsData.performance.uptime} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{analyticsData.performance.avgResponseTime}ms</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
              <Progress value={85} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {analyticsData.performance.p95ResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">95th Percentile</div>
              <Progress value={75} className="mt-2 h-2" />
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">{analyticsData.performance.errorRate}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <Progress value={analyticsData.performance.errorRate} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
