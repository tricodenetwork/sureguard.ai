"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useWebSocket } from "@/lib/websocket"
import { Shield, Activity, TrendingUp, TrendingDown, Eye, Zap, Target, CheckCircle, XCircle } from "lucide-react"

interface OverviewMetrics {
  totalThreats: number
  criticalThreats: number
  resolvedThreats: number
  activeInvestigations: number
  blockedIPs: number
  flaggedDevices: number
  suspiciousUsers: number
  apiCalls: number
  responseTime: number
  uptime: number
  falsePositives: number
  teamMembers: number
  trends: {
    threats: { value: number; direction: "up" | "down" | "stable" }
    resolution: { value: number; direction: "up" | "down" | "stable" }
    performance: { value: number; direction: "up" | "down" | "stable" }
  }
}

export function OverviewCards() {
  const { isConnected, messages } = useWebSocket()
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    totalThreats: 1247,
    criticalThreats: 23,
    resolvedThreats: 1156,
    activeInvestigations: 68,
    blockedIPs: 156,
    flaggedDevices: 89,
    suspiciousUsers: 12,
    apiCalls: 24700,
    responseTime: 145,
    uptime: 99.9,
    falsePositives: 34,
    teamMembers: 8,
    trends: {
      threats: { value: 12, direction: "up" },
      resolution: { value: 8, direction: "up" },
      performance: { value: 3, direction: "down" },
    },
  })

  useEffect(() => {
    // Update metrics based on real-time events
    if (messages.length > 0) {
      const latestMessage = messages[0]
      setMetrics((prev) => {
        const updated = { ...prev }

        switch (latestMessage.type) {
          case "threat_detected":
            updated.totalThreats += 1
            if (latestMessage.severity === "critical") {
              updated.criticalThreats += 1
            }
            break
          case "ip_blocked":
            updated.blockedIPs += 1
            break
          case "device_flagged":
            updated.flaggedDevices += 1
            break
          case "user_suspended":
            updated.suspiciousUsers += 1
            break
        }

        return updated
      })
    }
  }, [messages])

  const getTrendIcon = (direction: "up" | "down" | "stable") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Activity className="h-3 w-3 text-gray-600" />
    }
  }

  const getTrendColor = (direction: "up" | "down" | "stable") => {
    switch (direction) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Threat Overview */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span>Threat Overview</span>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Live" : "Offline"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.totalThreats.toLocaleString()}</div>
              <p className="text-xs text-gray-500">Total Threats</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-red-600">{metrics.criticalThreats}</div>
              <p className="text-xs text-red-500">Critical</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Resolution Rate</span>
              <span>{Math.round((metrics.resolvedThreats / metrics.totalThreats) * 100)}%</span>
            </div>
            <Progress value={(metrics.resolvedThreats / metrics.totalThreats) * 100} className="h-2" />
          </div>

          <div className="flex items-center space-x-1 text-xs">
            {getTrendIcon(metrics.trends.threats.direction)}
            <span className={getTrendColor(metrics.trends.threats.direction)}>
              {metrics.trends.threats.value}% from yesterday
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-bl-full opacity-20"></div>
      </Card>

      {/* Active Investigations */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span>Active Investigations</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.activeInvestigations}</div>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">{metrics.resolvedThreats}</div>
              <p className="text-xs text-green-500">Resolved</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-yellow-50 p-2 rounded">
              <div className="font-medium text-yellow-800">High Priority</div>
              <div className="text-yellow-600">12 cases</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-800">Team Assigned</div>
              <div className="text-blue-600">{metrics.teamMembers} members</div>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            {getTrendIcon(metrics.trends.resolution.direction)}
            <span className={getTrendColor(metrics.trends.resolution.direction)}>
              {metrics.trends.resolution.value}% faster resolution
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full opacity-20"></div>
      </Card>

      {/* Security Metrics */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span>Security Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{metrics.blockedIPs}</div>
              <p className="text-xs text-gray-500">Blocked IPs</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{metrics.flaggedDevices}</div>
              <p className="text-xs text-gray-500">Flagged Devices</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>False Positive Rate</span>
              <span>{Math.round((metrics.falsePositives / metrics.totalThreats) * 100)}%</span>
            </div>
            <Progress value={(metrics.falsePositives / metrics.totalThreats) * 100} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Accuracy: 97.3%</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>FP: 2.7%</span>
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full opacity-20"></div>
      </Card>

      {/* System Performance */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span>System Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{metrics.apiCalls.toLocaleString()}</div>
              <p className="text-xs text-gray-500">API Calls (24h)</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">{metrics.uptime}%</div>
              <p className="text-xs text-green-500">Uptime</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-green-800">Response Time</div>
              <div className="text-green-600">{metrics.responseTime}ms</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-800">Throughput</div>
              <div className="text-blue-600">1.2K/min</div>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            {getTrendIcon(metrics.trends.performance.direction)}
            <span className={getTrendColor(metrics.trends.performance.direction)}>
              {metrics.trends.performance.value}% performance change
            </span>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full opacity-20"></div>
      </Card>
    </div>
  )
}
