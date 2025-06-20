"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Smartphone, Monitor, Tablet, Shield, MapPin, Clock } from "lucide-react"

interface DeviceCardProps {
  device: {
    id: string
    type: "desktop" | "mobile" | "tablet"
    os: string
    browser: string
    location: string
    lastSeen: string
    riskScore: number
    isActive: boolean
    fingerprint: string
  }
  onTrack?: (deviceId: string) => void
}

export function DeviceCard({ device, onTrack }: DeviceCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50"
    if (score >= 60) return "text-orange-600 bg-orange-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getDeviceIcon(device.type)}
            <CardTitle className="text-sm font-medium capitalize">{device.type}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={device.isActive ? "default" : "secondary"}>{device.isActive ? "Active" : "Inactive"}</Badge>
            <Badge className={getRiskColor(device.riskScore)}>Risk: {device.riskScore}%</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">OS:</span>
            <span className="font-medium">{device.os}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Browser:</span>
            <span className="font-medium">{device.browser}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fingerprint:</span>
            <span className="font-mono text-xs">{device.fingerprint.slice(0, 8)}...</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{device.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{device.lastSeen}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onTrack?.(device.id)}>
            <Shield className="h-3 w-3 mr-1" />
            Track
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
