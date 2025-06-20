"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Activity } from "lucide-react"

interface IPData {
  ip: string
  country: string
  city: string
  region: string
  isp: string
  threat_level: "low" | "medium" | "high" | "critical"
  is_vpn: boolean
  is_proxy: boolean
  last_seen: string
  request_count: number
}

interface IPTrackerProps {
  className?: string
}

export function IPTracker({ className }: IPTrackerProps) {
  const [activeIPs, setActiveIPs] = useState<IPData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate real-time IP tracking
    const fetchIPs = () => {
      const mockIPs: IPData[] = [
        {
          ip: "203.0.113.1",
          country: "United States",
          city: "New York",
          region: "NY",
          isp: "Cloudflare",
          threat_level: "high",
          is_vpn: false,
          is_proxy: false,
          last_seen: "2 mins ago",
          request_count: 45,
        },
        {
          ip: "198.51.100.1",
          country: "United Kingdom",
          city: "London",
          region: "England",
          isp: "British Telecom",
          threat_level: "medium",
          is_vpn: true,
          is_proxy: false,
          last_seen: "5 mins ago",
          request_count: 23,
        },
        {
          ip: "192.0.2.1",
          country: "Germany",
          city: "Berlin",
          region: "Berlin",
          isp: "Deutsche Telekom",
          threat_level: "low",
          is_vpn: false,
          is_proxy: true,
          last_seen: "8 mins ago",
          request_count: 12,
        },
      ]
      setActiveIPs(mockIPs)
      setIsLoading(false)
    }

    fetchIPs()
    const interval = setInterval(fetchIPs, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getThreatColor = (level: string) => {
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

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 animate-pulse" />
            <span>Real-time IP Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Real-time IP Tracking</span>
          <Badge variant="outline" className="ml-auto">
            {activeIPs.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeIPs.map((ip) => (
            <div key={ip.ip} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-mono text-sm font-medium">{ip.ip}</div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {ip.city}, {ip.country}
                    </span>
                    <span>•</span>
                    <span>{ip.isp}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getThreatColor(ip.threat_level)}>{ip.threat_level}</Badge>
                {ip.is_vpn && <Badge variant="outline">VPN</Badge>}
                {ip.is_proxy && <Badge variant="outline">Proxy</Badge>}
                <div className="text-xs text-gray-500">{ip.request_count} reqs</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
