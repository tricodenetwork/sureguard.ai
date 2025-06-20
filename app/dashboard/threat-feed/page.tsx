"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, AlertTriangle, Search, Filter, MoreHorizontal, Clock, MapPin } from "lucide-react"

const threats = [
  {
    id: 1,
    type: "Carding",
    riskScore: 90,
    transactionId: "1234567890",
    timestamp: "3 mins ago",
    location: "Unknown",
    status: "critical",
    description: "Multiple failed payment attempts detected",
  },
  {
    id: 2,
    type: "Account takeover",
    riskScore: 80,
    transactionId: "1234567890",
    timestamp: "6 mins ago",
    location: "New York, US",
    status: "high",
    description: "Suspicious login from new device",
  },
  {
    id: 3,
    type: "Identity theft",
    riskScore: 70,
    transactionId: "1234567890",
    timestamp: "9 mins ago",
    location: "London, UK",
    status: "medium",
    description: "Personal information mismatch detected",
  },
  {
    id: 4,
    type: "Phishing",
    riskScore: 60,
    transactionId: "1234567890",
    timestamp: "12 mins ago",
    location: "Tokyo, JP",
    status: "medium",
    description: "Suspicious email link clicked",
  },
  {
    id: 5,
    type: "Malware",
    riskScore: 50,
    transactionId: "1234567890",
    timestamp: "15 mins ago",
    location: "Berlin, DE",
    status: "low",
    description: "Potential malware signature detected",
  },
]

export default function ThreatFeed() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

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

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.type.toLowerCase().includes(searchQuery.toLowerCase()) || threat.transactionId.includes(searchQuery)
    const matchesFilter = filterStatus === "all" || threat.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Threat Feed
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Filter className="mr-2 h-4 w-4" />
              Rules
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Investigations
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
          <div className="p-4 mt-auto">
            <Button className="w-full bg-green-600 hover:bg-green-700">New rule</Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Threat feed</h1>
            <p className="text-gray-600">Monitor and respond to security threats in real-time</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by transaction ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Critical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="moderate">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Moderate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="resolved">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Resolved" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Live Threats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live threats</h2>
            <div className="space-y-4">
              {filteredThreats.map((threat) => (
                <Card key={threat.id} className="hover:shadow-md transition-shadow">
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
                            <span className={`font-medium ${getRiskScoreColor(threat.riskScore)}`}>
                              Risk score: {threat.riskScore}
                            </span>
                            <span>Transaction ID: {threat.transactionId}</span>
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
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                        <Button variant="outline" size="sm">
                          Block
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
