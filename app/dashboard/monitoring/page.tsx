"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  Shield,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

export default function MonitoringPage() {
  const [realTimeData, setRealTimeData] = useState({
    activeThreats: 12,
    blockedAttempts: 847,
    activeUsers: 1234,
    systemHealth: 98.5,
    responseTime: 45,
    uptime: 99.9,
  })

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "critical",
      title: "Suspicious Login Pattern Detected",
      description: "Multiple failed login attempts from IP 192.168.1.100",
      timestamp: "2 minutes ago",
      status: "active",
    },
    {
      id: 2,
      type: "warning",
      title: "High Transaction Volume",
      description: "Unusual transaction volume detected for user ID 12345",
      timestamp: "5 minutes ago",
      status: "investigating",
    },
    {
      id: 3,
      type: "info",
      title: "System Update Complete",
      description: "Fraud detection models updated successfully",
      timestamp: "15 minutes ago",
      status: "resolved",
    },
  ])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        activeThreats: prev.activeThreats + Math.floor(Math.random() * 3) - 1,
        blockedAttempts: prev.blockedAttempts + Math.floor(Math.random() * 5),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        responseTime: prev.responseTime + Math.floor(Math.random() * 10) - 5,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getAlertBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "investigating":
        return <Badge variant="secondary">Investigating</Badge>
      case "resolved":
        return <Badge variant="outline">Resolved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Real-time Monitoring</h1>
          <p className="mt-2 text-gray-600">Monitor your fraud protection system in real-time</p>
        </div>

        {/* System Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Threats</p>
                    <p className="text-2xl font-bold text-red-600">{realTimeData.activeThreats}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">+2 from last hour</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blocked Attempts</p>
                    <p className="text-2xl font-bold text-green-600">{realTimeData.blockedAttempts}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+47 from last hour</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-blue-600">{realTimeData.activeUsers}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-gray-600">-5 from last hour</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                    <p className="text-2xl font-bold text-green-600">{realTimeData.systemHealth}%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={realTimeData.systemHealth} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Real-time Alerts
                </CardTitle>
                <CardDescription>Latest security alerts and system notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          {getAlertBadge(alert.status)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Performance */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Current system metrics and performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-gray-600">{realTimeData.responseTime}ms</span>
                  </div>
                  <Progress value={(100 - realTimeData.responseTime) * 2} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm text-gray-600">{realTimeData.uptime}%</span>
                  </div>
                  <Progress value={realTimeData.uptime} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-gray-600">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-gray-600">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>All systems operational. Last check: 30 seconds ago</AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Monitoring Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="network" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="network">Network Traffic</TabsTrigger>
              <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
              <TabsTrigger value="users">User Activity</TabsTrigger>
              <TabsTrigger value="api">API Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Network Traffic Analysis</CardTitle>
                  <CardDescription>Real-time network traffic and connection monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Network traffic visualization would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="threats" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Threat Analysis Dashboard</CardTitle>
                  <CardDescription>Detailed analysis of detected threats and attack patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Threat analysis charts would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Monitoring</CardTitle>
                  <CardDescription>Track user behavior and identify suspicious activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    User activity timeline would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Performance Monitoring</CardTitle>
                  <CardDescription>Monitor API endpoints, response times, and error rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    API monitoring dashboard would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
