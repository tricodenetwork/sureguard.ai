"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())
  const [reportType, setReportType] = useState("weekly")

  const reports = [
    {
      id: 1,
      title: "Weekly Security Summary",
      description: "Comprehensive overview of security events and threats",
      type: "security",
      date: "2024-01-15",
      status: "completed",
      size: "2.4 MB",
    },
    {
      id: 2,
      title: "Monthly Fraud Analysis",
      description: "Detailed analysis of fraud patterns and prevention metrics",
      type: "fraud",
      date: "2024-01-01",
      status: "completed",
      size: "5.1 MB",
    },
    {
      id: 3,
      title: "User Behavior Report",
      description: "Analysis of user activity patterns and anomalies",
      type: "behavior",
      date: "2024-01-10",
      status: "processing",
      size: "Generating...",
    },
    {
      id: 4,
      title: "API Usage Analytics",
      description: "API endpoint usage statistics and performance metrics",
      type: "api",
      date: "2024-01-12",
      status: "completed",
      size: "1.8 MB",
    },
  ]

  const metrics = {
    totalThreats: 1247,
    blockedAttacks: 892,
    falsePositives: 23,
    responseTime: 45,
    uptime: 99.9,
    apiCalls: 125000,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Completed
          </Badge>
        )
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="w-5 h-5 text-blue-600" />
      case "fraud":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "behavior":
        return <Users className="w-5 h-5 text-purple-600" />
      case "api":
        return <Activity className="w-5 h-5 text-green-600" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">Generate and download comprehensive security and fraud reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Threats</p>
                    <p className="text-2xl font-bold text-red-600">{metrics.totalThreats}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-600">+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blocked Attacks</p>
                    <p className="text-2xl font-bold text-green-600">{metrics.blockedAttacks}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+8% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">False Positives</p>
                    <p className="text-2xl font-bold text-yellow-600">{metrics.falsePositives}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TrendingDown className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">-15% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Calls</p>
                    <p className="text-2xl font-bold text-blue-600">{metrics.apiCalls.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-blue-600">+23% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Report Generation */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create custom reports based on your specific requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Report</SelectItem>
                        <SelectItem value="monthly">Monthly Analysis</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange ? format(dateRange, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="security" className="rounded" defaultChecked />
                    <label htmlFor="security" className="text-sm">
                      Security Events
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="fraud" className="rounded" defaultChecked />
                    <label htmlFor="fraud" className="text-sm">
                      Fraud Analysis
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="users" className="rounded" />
                    <label htmlFor="users" className="text-sm">
                      User Behavior
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="api" className="rounded" />
                    <label htmlFor="api" className="text-sm">
                      API Analytics
                    </label>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Download and manage your generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {getReportIcon(report.type)}
                        <div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>Generated: {report.date}</span>
                            <span>Size: {report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(report.status)}
                        {report.status === "completed" && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Key insights from your security data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Threat Detection Rate</span>
                    <span className="text-sm text-gray-600">94.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "94.2%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response Time</span>
                    <span className="text-sm text-gray-600">{metrics.responseTime}ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">System Uptime</span>
                    <span className="text-sm text-gray-600">{metrics.uptime}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Top Threat Categories</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Suspicious Logins</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Fraud</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Account Takeover</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bot Activity</span>
                      <span className="font-medium">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>Export your data in various formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Export as Excel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <PieChart className="w-4 h-4 mr-2" />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analytics Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="trends" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="trends" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Trends Analysis</CardTitle>
                  <CardDescription>Historical trends and patterns in your security data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Trend analysis charts would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patterns" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attack Pattern Recognition</CardTitle>
                  <CardDescription>Identify and analyze recurring attack patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Pattern recognition visualization would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Metrics</CardTitle>
                  <CardDescription>Detailed performance analytics and optimization insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Performance metrics dashboard would be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Reporting</CardTitle>
                  <CardDescription>Generate reports for regulatory compliance requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Compliance reporting tools would be implemented here
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
