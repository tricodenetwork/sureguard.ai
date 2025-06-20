"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWebSocket, type ThreatEvent } from "@/lib/websocket"
import { AlertTriangle, X, Shield, Clock, MapPin, CheckCircle } from "lucide-react"

interface ThreatAlert extends ThreatEvent {
  dismissed?: boolean
  acknowledged?: boolean
}

interface ThreatAlertsProps {
  className?: string
  maxAlerts?: number
}

export function ThreatAlerts({ className, maxAlerts = 5 }: ThreatAlertsProps) {
  const { subscribe } = useWebSocket()
  const [alerts, setAlerts] = useState<ThreatAlert[]>([])

  useEffect(() => {
    const unsubscribe = subscribe("threat-alerts", (event: ThreatEvent) => {
      // Only show critical and high severity alerts
      if (event.severity === "critical" || event.severity === "high") {
        setAlerts((prev) => [event, ...prev.slice(0, maxAlerts - 1)])
      }
    })

    return unsubscribe
  }, [subscribe, maxAlerts])

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)))

    // Remove after animation
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    }, 300)
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "high":
        return "border-orange-500 bg-orange-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getAlertIcon = (severity: string) => {
    return severity === "critical" ? (
      <AlertTriangle className="h-5 w-5 text-red-600" />
    ) : (
      <Shield className="h-5 w-5 text-orange-600" />
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const eventTime = new Date(timestamp)
    const diffMs = now.getTime() - eventTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    return `${Math.floor(diffMins / 60)}h ago`
  }

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)

  if (activeAlerts.length === 0) {
    return null
  }

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`} style={{ maxWidth: "400px" }}>
      {activeAlerts.map((alert) => (
        <Card
          key={alert.id}
          className={`${getSeverityColor(alert.severity)} border-l-4 shadow-lg transition-all duration-300 ${
            alert.dismissed ? "opacity-0 transform translate-x-full" : "opacity-100 transform translate-x-0"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getAlertIcon(alert.severity)}
                <div>
                  <CardTitle className="text-sm font-semibold">{alert.data.threatType || "Security Alert"}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      className={
                        alert.severity === "critical" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
                      }
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                    {alert.data.riskScore && <Badge variant="outline">Risk: {alert.data.riskScore}%</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 mb-3">{alert.data.description}</p>

            <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(alert.timestamp)}</span>
              </div>

              {alert.data.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{alert.data.location}</span>
                </div>
              )}

              {alert.data.ip && <span className="font-mono text-xs">{alert.data.ip}</span>}
            </div>

            <div className="flex items-center space-x-2">
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)} className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acknowledge
                </Button>
              )}
              <Button size="sm" variant="outline" className="text-xs">
                Investigate
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Block
              </Button>
            </div>

            {alert.acknowledged && (
              <div className="mt-2 text-xs text-green-600 flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>Acknowledged</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
