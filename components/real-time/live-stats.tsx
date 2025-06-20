"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWebSocket, type ThreatEvent } from "@/lib/websocket"
import { Shield, Activity, Globe, Users, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface LiveStatsProps {
  className?: string
}

interface Stats {
  totalThreats: number
  criticalThreats: number
  blockedIPs: number
  activeDevices: number
  suspiciousUsers: number
  threatsPerHour: number
  trends: {
    threats: "up" | "down" | "stable"
    ips: "up" | "down" | "stable"
    devices: "up" | "down" | "stable"
  }
}

export function LiveStats({ className }: LiveStatsProps) {
  const { isConnected, messages, subscribe } = useWebSocket()
  const [stats, setStats] = useState<Stats>({
    totalThreats: 1247,
    criticalThreats: 23,
    blockedIPs: 156,
    activeDevices: 89,
    suspiciousUsers: 12,
    threatsPerHour: 45,
    trends: {
      threats: "up",
      ips: "stable",
      devices: "down",
    },
  })

  const [recentActivity, setRecentActivity] = useState<
    {
      timestamp: number
      count: number
    }[]
  >([])

  useEffect(() => {
    const unsubscribe = subscribe("live-stats", (event: ThreatEvent) => {
      setStats((prev) => {
        const newStats = { ...prev }

        // Update counters based on event type
        switch (event.type) {
          case "threat_detected":
            newStats.totalThreats += 1
            if (event.severity === "critical") {
              newStats.criticalThreats += 1
            }
            break
          case "ip_blocked":
            newStats.blockedIPs += 1
            break
          case "device_flagged":
            newStats.activeDevices += 1
            break
          case "user_suspended":
            newStats.suspiciousUsers += 1
            break
        }

        return newStats
      })

      // Update activity tracking
      setRecentActivity((prev) => {
        const now = Date.now()
        const newActivity = [...prev, { timestamp: now, count: 1 }]

        // Keep only last hour of data
        const oneHourAgo = now - 60 * 60 * 1000
        return newActivity.filter((item) => item.timestamp > oneHourAgo)
      })
    })

    return unsubscribe
  }, [subscribe])

  // Calculate trends every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        trends: {
          threats: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
          ips: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
          devices: Math.random() > 0.5 ? "up" : Math.random() > 0.5 ? "down" : "stable",
        },
      }))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-green-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-red-600"
      case "down":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {/* Total Threats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Total Threats</span>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(stats.trends.threats)}
              <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Live" : "Offline"}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.totalThreats.toLocaleString()}</div>
          <p className={`text-xs ${getTrendColor(stats.trends.threats)}`}>{stats.criticalThreats} critical threats</p>
        </CardContent>
      </Card>

      {/* Blocked IPs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Blocked IPs</span>
            </div>
            {getTrendIcon(stats.trends.ips)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.blockedIPs.toLocaleString()}</div>
          <p className={`text-xs ${getTrendColor(stats.trends.ips)}`}>Auto-blocked today</p>
        </CardContent>
      </Card>

      {/* Active Devices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Active Devices</span>
            </div>
            {getTrendIcon(stats.trends.devices)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.activeDevices}</div>
          <p className={`text-xs ${getTrendColor(stats.trends.devices)}`}>Being monitored</p>
        </CardContent>
      </Card>

      {/* Suspicious Users */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Suspicious Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.suspiciousUsers}</div>
          <p className="text-xs text-orange-600">Flagged for review</p>
        </CardContent>
      </Card>

      {/* Threats Per Hour */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Threats/Hour</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{recentActivity.length || stats.threatsPerHour}</div>
          <p className="text-xs text-blue-600">Current rate</p>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{isConnected ? "100%" : "0%"}</div>
          <p className={`text-xs ${isConnected ? "text-green-600" : "text-red-600"}`}>
            {isConnected ? "All systems operational" : "Connection lost"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
