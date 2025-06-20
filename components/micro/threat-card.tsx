"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Clock, MapPin, MoreHorizontal } from "lucide-react"

interface ThreatCardProps {
  threat: {
    id: string
    type: string
    riskScore: number
    transactionId: string
    timestamp: string
    location: string
    status: "critical" | "high" | "medium" | "low"
    description: string
  }
  onAction?: (action: string, threatId: string) => void
}

export function ThreatCard({ threat, onAction }: ThreatCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{threat.type}</h3>
                <Badge className={getStatusColor(threat.status)}>{threat.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{threat.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className={`font-medium ${getRiskScoreColor(threat.riskScore)}`}>Risk: {threat.riskScore}%</span>
                <span>ID: {threat.transactionId}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{threat.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{threat.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onAction?.("investigate", threat.id)}>
              Investigate
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAction?.("block", threat.id)}>
              Block
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
