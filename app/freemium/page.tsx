"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Search,
  MapPin,
  Smartphone,
  AlertTriangle,
  Globe,
  Monitor,
  Clock,
  Activity,
  Eye,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DeviceData {
  ip: string
  location: {
    country: string
    city: string
    coordinates: [number, number]
  }
  device: {
    type: string
    os: string
    browser: string
    fingerprint: string
  }
  riskScore: number
  threats: Array<{
    type: string
    severity: "low" | "medium" | "high"
    timestamp: string
    description: string
  }>
  attachments: Array<{
    name: string
    type: string
    size: string
    lastAccessed: string
    riskLevel: "safe" | "suspicious" | "dangerous"
  }>
}

export default function FreemiumPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DeviceData | null>(null)
  const [showResults, setShowResults] = useState(false)

  // Mock data for demonstration
  const mockDeviceData: DeviceData = {
    ip: "192.168.1.100",
    location: {
      country: "United States",
      city: "San Francisco, CA",
      coordinates: [37.7749, -122.4194],
    },
    device: {
      type: "Desktop",
      os: "Windows 11",
      browser: "Chrome 120.0",
      fingerprint: "d4f2a1b8c3e5",
    },
    riskScore: 75,
    threats: [
      {
        type: "Suspicious Login",
        severity: "medium",
        timestamp: "2 hours ago",
        description: "Multiple failed login attempts detected",
      },
      {
        type: "Unusual Location",
        severity: "high",
        timestamp: "5 hours ago",
        description: "Access from new geographic location",
      },
      {
        type: "Device Fingerprint Change",
        severity: "low",
        timestamp: "1 day ago",
        description: "Minor changes in device configuration",
      },
    ],
    attachments: [
      {
        name: "financial_report.pdf",
        type: "PDF Document",
        size: "2.4 MB",
        lastAccessed: "3 hours ago",
        riskLevel: "safe",
      },
      {
        name: "unknown_executable.exe",
        type: "Executable",
        size: "15.7 MB",
        lastAccessed: "1 hour ago",
        riskLevel: "dangerous",
      },
      {
        name: "backup_data.zip",
        type: "Archive",
        size: "45.2 MB",
        lastAccessed: "6 hours ago",
        riskLevel: "suspicious",
      },
    ],
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Set mock data with the searched IP
    setSearchResults({
      ...mockDeviceData,
      ip: searchQuery,
    })
    setIsSearching(false)
    setShowResults(true)
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-orange-600"
    if (score >= 40) return "text-yellow-600"
    return "text-green-600"
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return "bg-red-100"
    if (score >= 60) return "bg-orange-100"
    if (score >= 40) return "bg-yellow-100"
    return "bg-green-100"
  }

  const getAttachmentRiskColor = (level: string) => {
    switch (level) {
      case "dangerous":
        return "text-red-600 bg-red-50 border-red-200"
      case "suspicious":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getThreatSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-yellow-600 bg-yellow-50"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">SureGuard</span>
            <Badge variant="secondary" className="ml-2">
              Freemium
            </Badge>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Search Section */}
      <section className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Device Attachment Tracker</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Enter an IP address or device identifier to analyze device attachments, security risks, and threat
              patterns in real-time.
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
              <Input
                type="text"
                placeholder="Enter IP address (e.g., 192.168.1.100)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow border-0 focus:ring-0 text-lg px-6 py-4"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 rounded-none rounded-r-full"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Track Device</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 text-white/80 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p>Free tier includes: 5 searches per day • Basic threat detection • Limited device insights</p>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && searchResults && (
          <motion.section
            className="py-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        IP Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{searchResults.ip}</div>
                      <p className="text-xs text-gray-500">{searchResults.location.city}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        Device Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{searchResults.device.type}</div>
                      <p className="text-xs text-gray-500">{searchResults.device.os}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Risk Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getRiskColor(searchResults.riskScore)}`}>
                        {searchResults.riskScore}/100
                      </div>
                      <Progress value={searchResults.riskScore} className="mt-2" />
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                        <Activity className="h-4 w-4 mr-2" />
                        Attachments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">{searchResults.attachments.length}</div>
                      <p className="text-xs text-gray-500">Files detected</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Device Attachments */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Smartphone className="h-5 w-5 mr-2" />
                        Device Attachments
                      </CardTitle>
                      <CardDescription>Files and attachments associated with this device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {searchResults.attachments.map((attachment, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-lg border ${getAttachmentRiskColor(attachment.riskLevel)}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{attachment.name}</div>
                            <Badge
                              variant={
                                attachment.riskLevel === "dangerous"
                                  ? "destructive"
                                  : attachment.riskLevel === "suspicious"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {attachment.riskLevel}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Type: {attachment.type}</div>
                            <div>Size: {attachment.size}</div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Last accessed: {attachment.lastAccessed}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Threat Analysis */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Threat Analysis
                      </CardTitle>
                      <CardDescription>Security threats and anomalies detected</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {searchResults.threats.map((threat, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-lg ${getThreatSeverityColor(threat.severity)}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{threat.type}</div>
                            <Badge variant={threat.severity === "high" ? "destructive" : "secondary"}>
                              {threat.severity}
                            </Badge>
                          </div>
                          <div className="text-sm mb-2">{threat.description}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {threat.timestamp}
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Device Information */}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="h-5 w-5 mr-2" />
                      Device Fingerprint & Location
                    </CardTitle>
                    <CardDescription>Detailed device information and geographic location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Device Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Operating System:</span>
                              <span className="font-medium">{searchResults.device.os}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Browser:</span>
                              <span className="font-medium">{searchResults.device.browser}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Fingerprint ID:</span>
                              <span className="font-mono text-xs">{searchResults.device.fingerprint}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Geographic Location
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Country:</span>
                              <span className="font-medium">{searchResults.location.country}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">City:</span>
                              <span className="font-medium">{searchResults.location.city}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Coordinates:</span>
                              <span className="font-mono text-xs">
                                {searchResults.location.coordinates[0]}, {searchResults.location.coordinates[1]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upgrade CTA */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Card className="bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Want deeper insights and unlimited searches?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Upgrade to SureGuard Pro for advanced threat detection, real-time monitoring, detailed forensic
                      analysis, and unlimited device tracking capabilities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/dashboard">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        >
                          Upgrade to Pro - $79/month
                        </Button>
                      </Link>
                      <Link href="/demo">
                        <Button size="lg" variant="outline">
                          Schedule Demo
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Features Preview (when no results) */}
      {!showResults && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What you'll discover with device tracking
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get comprehensive insights into device attachments, security risks, and threat patterns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Smartphone,
                  title: "Device Attachments",
                  description:
                    "Identify all files and attachments associated with a device, including risk assessment for each item.",
                },
                {
                  icon: MapPin,
                  title: "Geographic Tracking",
                  description:
                    "Track device location history and identify unusual access patterns from different geographic regions.",
                },
                {
                  icon: Shield,
                  title: "Threat Detection",
                  description:
                    "Advanced AI algorithms detect suspicious activities, malware, and potential security breaches in real-time.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                    <feature.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
