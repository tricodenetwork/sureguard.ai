"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Activity } from "lucide-react"

interface GeoLocation {
  id: string
  lat: number
  lng: number
  city: string
  country: string
  threat_count: number
  risk_level: "low" | "medium" | "high" | "critical"
  timestamp: string
}

interface GeoMapProps {
  className?: string
}

export function GeoMap({ className }: GeoMapProps) {
  const [locations, setLocations] = useState<GeoLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null)

  useEffect(() => {
    // Simulate real-time geolocation data
    const mockLocations: GeoLocation[] = [
      {
        id: "1",
        lat: 40.7128,
        lng: -74.006,
        city: "New York",
        country: "United States",
        threat_count: 15,
        risk_level: "high",
        timestamp: "2 mins ago",
      },
      {
        id: "2",
        lat: 51.5074,
        lng: -0.1278,
        city: "London",
        country: "United Kingdom",
        threat_count: 8,
        risk_level: "medium",
        timestamp: "5 mins ago",
      },
      {
        id: "3",
        lat: 35.6762,
        lng: 139.6503,
        city: "Tokyo",
        country: "Japan",
        threat_count: 3,
        risk_level: "low",
        timestamp: "8 mins ago",
      },
      {
        id: "4",
        lat: 52.52,
        lng: 13.405,
        city: "Berlin",
        country: "Germany",
        threat_count: 12,
        risk_level: "high",
        timestamp: "1 min ago",
      },
    ]

    setLocations(mockLocations)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-green-600" />
          <span>Global Threat Map</span>
          <Badge variant="outline" className="ml-auto">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simplified map representation */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-lg"></div>

          {/* Location markers */}
          {locations.map((location) => (
            <div
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((location.lng + 180) / 360) * 100}%`,
                top: `${((90 - location.lat) / 180) * 100}%`,
              }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className={`w-4 h-4 rounded-full ${getRiskColor(
                  location.risk_level,
                )} animate-pulse shadow-lg border-2 border-white`}
              ></div>
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max text-xs border">
                <div className="font-medium">{location.city}</div>
                <div className="text-gray-500">{location.threat_count} threats</div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="text-xs font-medium mb-2">Threat Levels</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location details */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Recent Activity</span>
          </div>
          {locations.slice(0, 3).map((location) => (
            <div key={location.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">
                  {location.city}, {location.country}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getRiskBadgeColor(location.risk_level)}>{location.risk_level}</Badge>
                <span className="text-xs text-gray-500">{location.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
