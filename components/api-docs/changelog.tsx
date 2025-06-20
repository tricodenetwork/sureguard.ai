"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Zap, Bug, AlertTriangle, CheckCircle, Calendar, GitCommit } from "lucide-react"

interface ChangelogEntry {
  version: string
  date: string
  type: "major" | "minor" | "patch"
  changes: Array<{
    type: "added" | "improved" | "fixed" | "deprecated" | "removed"
    description: string
    breaking?: boolean
  }>
}

const changelogData: ChangelogEntry[] = [
  {
    version: "2.1.0",
    date: "2024-01-18",
    type: "minor",
    changes: [
      {
        type: "added",
        description: "New AI-powered behavioral analysis for device fingerprinting",
      },
      {
        type: "added",
        description: "Real-time monitoring API with custom alert rules",
      },
      {
        type: "improved",
        description: "Enhanced geolocation accuracy with ISP detection",
      },
      {
        type: "improved",
        description: "Reduced average response time by 25%",
      },
      {
        type: "fixed",
        description: "Fixed issue with WebSocket connection stability",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2024-01-10",
    type: "major",
    changes: [
      {
        type: "added",
        description: "Complete API redesign with improved performance",
        breaking: true,
      },
      {
        type: "added",
        description: "Advanced device spoofing detection algorithms",
      },
      {
        type: "added",
        description: "Machine learning-based risk scoring system",
      },
      {
        type: "deprecated",
        description: "Legacy v1 endpoints (will be removed in v3.0)",
      },
      {
        type: "improved",
        description: "Enhanced error handling and response codes",
      },
    ],
  },
  {
    version: "1.9.2",
    date: "2024-01-05",
    type: "patch",
    changes: [
      {
        type: "fixed",
        description: "Resolved memory leak in threat detection engine",
      },
      {
        type: "fixed",
        description: "Fixed rate limiting headers not being returned",
      },
      {
        type: "improved",
        description: "Better handling of malformed requests",
      },
    ],
  },
  {
    version: "1.9.1",
    date: "2024-01-02",
    type: "patch",
    changes: [
      {
        type: "fixed",
        description: "Critical security vulnerability in authentication",
      },
      {
        type: "improved",
        description: "Enhanced input validation for all endpoints",
      },
    ],
  },
  {
    version: "1.9.0",
    date: "2023-12-28",
    type: "minor",
    changes: [
      {
        type: "added",
        description: "New webhook system for real-time notifications",
      },
      {
        type: "added",
        description: "Batch processing API for high-volume analysis",
      },
      {
        type: "improved",
        description: "Enhanced VPN/Proxy detection accuracy",
      },
      {
        type: "fixed",
        description: "Timezone handling in geolocation data",
      },
    ],
  },
]

export function Changelog() {
  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4 text-green-600" />
      case "improved":
        return <Zap className="h-4 w-4 text-blue-600" />
      case "fixed":
        return <Bug className="h-4 w-4 text-orange-600" />
      case "deprecated":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "removed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getVersionBadgeColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-red-100 text-red-800 border-red-200"
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "patch":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitCommit className="h-5 w-5" />
          <span>API Changelog</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-6">
            {changelogData.map((entry, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>

                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge className={getVersionBadgeColor(entry.type)}>v{entry.version}</Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{entry.date}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {entry.type}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      {getChangeIcon(change.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{change.description}</span>
                          {change.breaking && (
                            <Badge variant="destructive" className="text-xs">
                              Breaking
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Stay Updated</h4>
          <p className="text-sm text-blue-700 mb-3">
            Subscribe to our changelog to get notified about new API versions and important updates.
          </p>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Subscribe</button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
