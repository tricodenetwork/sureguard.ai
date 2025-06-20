"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Globe,
  Zap,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  Slack,
  Mail,
  MessageSquare,
  Webhook,
  Database,
  Cloud,
  Code,
} from "lucide-react"

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "Slack",
      description: "Get real-time alerts in your Slack channels",
      icon: Slack,
      category: "notifications",
      status: "connected",
      config: { channel: "#security-alerts", webhook: "https://hooks.slack.com/..." },
    },
    {
      id: 2,
      name: "Email Notifications",
      description: "Receive security alerts via email",
      icon: Mail,
      category: "notifications",
      status: "connected",
      config: { email: "security@company.com", frequency: "immediate" },
    },
    {
      id: 3,
      name: "Webhook",
      description: "Send security events to your custom endpoint",
      icon: Webhook,
      category: "api",
      status: "disconnected",
      config: { url: "", secret: "" },
    },
    {
      id: 4,
      name: "Microsoft Teams",
      description: "Get notifications in Microsoft Teams",
      icon: MessageSquare,
      category: "notifications",
      status: "available",
      config: {},
    },
    {
      id: 5,
      name: "AWS CloudWatch",
      description: "Send logs and metrics to AWS CloudWatch",
      icon: Cloud,
      category: "monitoring",
      status: "available",
      config: {},
    },
    {
      id: 6,
      name: "Splunk",
      description: "Forward security events to Splunk",
      icon: Database,
      category: "siem",
      status: "available",
      config: {},
    },
  ])

  const [selectedIntegration, setSelectedIntegration] = useState<any>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>
      case "available":
        return <Badge variant="outline">Available</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "disconnected":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "available":
        return <Plus className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const toggleIntegration = (id: number) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : "connected",
            }
          : integration,
      ),
    )
  }

  const categories = [
    { id: "all", name: "All Integrations", count: integrations.length },
    {
      id: "notifications",
      name: "Notifications",
      count: integrations.filter((i) => i.category === "notifications").length,
    },
    { id: "api", name: "API & Webhooks", count: integrations.filter((i) => i.category === "api").length },
    { id: "monitoring", name: "Monitoring", count: integrations.filter((i) => i.category === "monitoring").length },
    { id: "siem", name: "SIEM", count: integrations.filter((i) => i.category === "siem").length },
  ]

  const [activeCategory, setActiveCategory] = useState("all")

  const filteredIntegrations =
    activeCategory === "all" ? integrations : integrations.filter((i) => i.category === activeCategory)

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">Connect SureGuard AI with your existing tools and workflows</p>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                    <p className="text-2xl font-bold text-blue-600">{integrations.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {integrations.filter((i) => i.status === "connected").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {integrations.filter((i) => i.status === "available").length}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Events Sent</p>
                    <p className="text-2xl font-bold text-purple-600">12,847</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Filter */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Filter integrations by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="outline">{category.count}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Integrations List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIntegrations.map((integration) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <integration.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                        {getStatusIcon(integration.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        {getStatusBadge(integration.status)}
                        <div className="flex items-center space-x-2">
                          {integration.status === "connected" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Configure {integration.name}</DialogTitle>
                                  <DialogDescription>
                                    Manage your {integration.name} integration settings
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  {integration.name === "Slack" && (
                                    <>
                                      <div>
                                        <Label htmlFor="channel">Slack Channel</Label>
                                        <Input
                                          id="channel"
                                          defaultValue={integration.config.channel}
                                          placeholder="#security-alerts"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="webhook">Webhook URL</Label>
                                        <Input
                                          id="webhook"
                                          defaultValue={integration.config.webhook}
                                          placeholder="https://hooks.slack.com/..."
                                        />
                                      </div>
                                    </>
                                  )}
                                  {integration.name === "Email Notifications" && (
                                    <>
                                      <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                          id="email"
                                          defaultValue={integration.config.email}
                                          placeholder="security@company.com"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="frequency">Notification Frequency</Label>
                                        <select className="w-full p-2 border rounded-md">
                                          <option value="immediate">Immediate</option>
                                          <option value="hourly">Hourly Digest</option>
                                          <option value="daily">Daily Summary</option>
                                        </select>
                                      </div>
                                    </>
                                  )}
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Save Changes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {integration.status === "connected" ? (
                            <Button variant="outline" size="sm" onClick={() => toggleIntegration(integration.id)}>
                              Disconnect
                            </Button>
                          ) : integration.status === "available" ? (
                            <Button size="sm" onClick={() => toggleIntegration(integration.id)}>
                              Connect
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => toggleIntegration(integration.id)}>
                              Reconnect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Custom Integration */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Custom Integration
                </CardTitle>
                <CardDescription>Don't see your tool? Create a custom integration using our API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Use our REST API and webhooks to integrate with any system
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>• REST API</span>
                      <span>• Webhooks</span>
                      <span>• Real-time events</span>
                      <span>• Custom endpoints</span>
                    </div>
                  </div>
                  <Button>View API Docs</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events sent to your integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  integration: "Slack",
                  event: "Suspicious login detected",
                  timestamp: "2 minutes ago",
                  status: "sent",
                },
                {
                  integration: "Email",
                  event: "Weekly security report",
                  timestamp: "1 hour ago",
                  status: "sent",
                },
                {
                  integration: "Webhook",
                  event: "Payment fraud alert",
                  timestamp: "3 hours ago",
                  status: "failed",
                },
                {
                  integration: "Slack",
                  event: "System maintenance complete",
                  timestamp: "6 hours ago",
                  status: "sent",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${activity.status === "sent" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{activity.event}</p>
                      <p className="text-sm text-gray-600">Sent to {activity.integration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.status === "sent" ? "outline" : "destructive"}>{activity.status}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
