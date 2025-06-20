"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Key, Bell, CreditCard, SettingsIcon, Eye, RotateCcw, Webhook } from "lucide-react"

export default function Settings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [fraudAlertsEnabled, setFraudAlertsEnabled] = useState(true)
  const [reportsEnabled, setReportsEnabled] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard.ai</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <div className="font-semibold">Settings</div>
                <div className="text-sm text-orange-600">Manage your account</div>
              </div>
            </div>
          </div>
          <nav className="px-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
              <User className="mr-2 h-4 w-4" />
              Personal Info
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Key className="mr-2 h-4 w-4" />
              API Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Bell className="mr-2 h-4 w-4" />
              Notification Preferences
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Plan & Billing
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>API Settings</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notification Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Plan & Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="font-medium">Avatar</div>
                          <div className="text-sm text-gray-500">Update your profile picture</div>
                        </div>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-6 w-6 text-gray-400" />
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-500">Add an extra layer of security</div>
                        </div>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Settings</CardTitle>
                  <CardDescription>Manage your API keys and access controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Key className="h-6 w-6 text-gray-400" />
                        <div>
                          <div className="font-medium">Rotate API Key</div>
                          <div className="text-sm text-gray-500">Generate a new API key</div>
                        </div>
                      </div>
                      <Button variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-6 w-6 text-gray-400" />
                        <div>
                          <div className="font-medium">Access Logs</div>
                          <div className="text-sm text-gray-500">View API usage and access history</div>
                        </div>
                      </div>
                      <Button variant="outline">View</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Webhook className="h-6 w-6 text-gray-400" />
                        <div>
                          <div className="font-medium">Webhooks</div>
                          <div className="text-sm text-gray-500">Configure webhook endpoints</div>
                        </div>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about threats and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-6 w-6 text-red-500" />
                        <div>
                          <div className="font-medium">Fraud Alerts</div>
                          <div className="text-sm text-gray-500">Get notified about critical security threats</div>
                        </div>
                      </div>
                      <Switch checked={fraudAlertsEnabled} onCheckedChange={setFraudAlertsEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-6 w-6 text-blue-500" />
                        <div>
                          <div className="font-medium">Reports</div>
                          <div className="text-sm text-gray-500">Receive weekly security reports</div>
                        </div>
                      </div>
                      <Switch checked={reportsEnabled} onCheckedChange={setReportsEnabled} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plan & Billing</CardTitle>
                  <CardDescription>Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Current Plan</div>
                      <div className="text-sm text-gray-500">You are currently on the Premium plan</div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Premium</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Usage Stats</div>
                      <div className="text-sm text-gray-500">API calls this month</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">75% utilized</div>
                      <div className="text-sm text-gray-500">75,000 / 100,000</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="bg-green-600 hover:bg-green-700">Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
