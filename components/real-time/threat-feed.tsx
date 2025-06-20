"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWebSocket, type ThreatEvent } from "@/lib/websocket"
import { Shield, AlertTriangle, Wifi, WifiOff, Activity, Clock, MapPin, User, Monitor } from "lucide-react"

interface RealTimeThreatFeedProps {
  className?: string
  maxItems?: number
}

export function RealTimeThreatFeed({ className, maxItems = 50 }: RealTimeThreatFeedProps) {
  const { isConnected, isConnecting, error, messages, connectionCount } = useWebSocket()
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")
  const [isPaused, setIsPaused] = useState(false)
  const [displayMessages, setDisplayMessages] = useState<ThreatEvent[]>([])

  useEffect(() => {
    if (!isPaused) {
      const filtered = filter === "all" ? messages : messages.filter((msg) => msg.severity === filter)

      setDisplayMessages(filtered.slice(0, maxItems))
    }
  }, [messages, filter, isPaused, maxItems])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "threat_detected":
        return <AlertTriangle className="h-4 w-4" />
      case "ip_blocked":
        return <Shield className="h-4 w-4" />
      case "device_flagged":
        return <Monitor className="h-4 w-4" />
      case "user_suspended":
        return <User className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const eventTime = new Date(timestamp)
    const diffMs = now.getTime() - eventTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return eventTime.toLocaleDateString()
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-orange-600" />
            <CardTitle>Live Threat Feed</CardTitle>
            <div className="flex items-center space-x-1">
              {isConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnecting ? "Connecting..." : isConnected ? "Live" : "Disconnected"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant={isPaused ? "default" : "outline"} onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
        </div>
        <CardDescription>
          Real-time security threats and incidents • {displayMessages.length} events
          {connectionCount > 1 && ` • Reconnected ${connectionCount - 1} times`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          {["all", "critical", "high", "medium", "low"].map((severity) => (
            <Button
              key={severity}
              size="sm"
              variant={filter === severity ? "default" : "outline"}
              onClick={() => setFilter(severity as any)}
              className="capitalize"
            >
              {severity}
              {severity !== "all" && (
                <Badge variant="secondary" className="ml-1">
                  {messages.filter((m) => m.severity === severity).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Threat Events */}
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {displayMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {isPaused ? "Feed paused" : "Waiting for threat events..."}
              </div>
            ) : (
              displayMessages.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.severity === "critical"
                        ? "bg-red-100"
                        : event.severity === "high"
                          ? "bg-orange-100"
                          : event.severity === "medium"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                    }`}
                  >
                    {getTypeIcon(event.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {event.data.threatType || event.type.replace("_", " ")}
                      </h4>
                      <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                      {event.data.riskScore && <Badge variant="outline">Risk: {event.data.riskScore}%</Badge>}
                    </div>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.data.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(event.timestamp)}</span>
                      </div>

                      {event.data.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.data.location}</span>
                        </div>
                      )}

                      {event.data.ip && (
                        <div className="flex items-center space-x-1">
                          <span className="font-mono">{event.data.ip}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Connection Stats */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {isConnected ? "Connected" : "Disconnected"} •{messages.length} total events
            </span>
            <span>Last update: {messages[0] ? formatTimestamp(messages[0].timestamp) : "Never"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
