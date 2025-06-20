"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, MessageSquare, Activity, Search, Bell, Settings, Plus } from "lucide-react"
import { TeamDashboard } from "@/components/collaboration/team-dashboard"
import { ThreatAnalysisPanel } from "@/components/collaboration/threat-analysis"

export default function CollaborationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("team")

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search team members, threats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
              <Users className="mr-2 h-4 w-4" />
              Team Collaboration
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Threat Analysis
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Investigations
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="team">Team Dashboard</TabsTrigger>
              <TabsTrigger value="investigations">Active Investigations</TabsTrigger>
              <TabsTrigger value="reports">Team Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="team" className="space-y-6">
              <TeamDashboard />
            </TabsContent>

            <TabsContent value="investigations" className="space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Active Investigations</h1>
                <p className="text-gray-600">Collaborative threat analysis and investigation management</p>
              </div>

              <ThreatAnalysisPanel threatId="THR-2024-001" />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Reports</h1>
                <p className="text-gray-600">Performance metrics and collaboration analytics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Team performance metrics for this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <p className="text-sm text-gray-600">Threat resolution rate</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Collaboration Score</CardTitle>
                    <CardDescription>Team collaboration effectiveness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">8.7/10</div>
                    <p className="text-sm text-gray-600">Average team rating</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average time to first response</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">12m</div>
                    <p className="text-sm text-gray-600">15% improvement</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generate Report</CardTitle>
                      <CardDescription>Create custom team performance reports</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Select report parameters and generate comprehensive team analytics.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
