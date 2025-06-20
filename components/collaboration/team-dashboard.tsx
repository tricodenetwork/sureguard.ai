"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  MessageSquare,
  Clock,
  Target,
  ActivityIcon,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Settings,
  Bell,
  Calendar,
  BarChart3,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  role: "analyst" | "senior_analyst" | "team_lead" | "admin"
  status: "online" | "away" | "offline"
  expertise: string[]
  activeThreats: number
  resolvedToday: number
  avgResponseTime: string
  lastActive: string
  workload: "light" | "moderate" | "heavy"
}

interface TeamMetrics {
  totalMembers: number
  onlineMembers: number
  activeThreats: number
  resolvedToday: number
  avgResponseTime: string
  teamEfficiency: number
  collaborationScore: number
}

interface TeamActivity {
  id: string
  type: "threat_assigned" | "threat_resolved" | "comment_added" | "evidence_uploaded" | "status_changed"
  description: string
  user: TeamMember
  timestamp: string
  threatId?: string
}

export function TeamDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [metrics, setMetrics] = useState<TeamMetrics>({
    totalMembers: 8,
    onlineMembers: 6,
    activeThreats: 23,
    resolvedToday: 15,
    avgResponseTime: "12m",
    teamEfficiency: 87,
    collaborationScore: 92,
  })
  const [activities, setActivities] = useState<TeamActivity[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Mock team data
    setTeamMembers([
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        avatar: "/avatars/sarah.jpg",
        role: "senior_analyst",
        status: "online",
        expertise: ["fraud_detection", "payment_security", "machine_learning"],
        activeThreats: 5,
        resolvedToday: 3,
        avgResponseTime: "8m",
        lastActive: "2 minutes ago",
        workload: "moderate",
      },
      {
        id: "2",
        name: "Mike Rodriguez",
        email: "mike.rodriguez@company.com",
        avatar: "/avatars/mike.jpg",
        role: "analyst",
        status: "online",
        expertise: ["network_analysis", "threat_hunting", "incident_response"],
        activeThreats: 3,
        resolvedToday: 2,
        avgResponseTime: "15m",
        lastActive: "5 minutes ago",
        workload: "light",
      },
      {
        id: "3",
        name: "Emily Watson",
        email: "emily.watson@company.com",
        avatar: "/avatars/emily.jpg",
        role: "team_lead",
        status: "online",
        expertise: ["team_management", "strategic_analysis", "compliance"],
        activeThreats: 2,
        resolvedToday: 1,
        avgResponseTime: "10m",
        lastActive: "1 minute ago",
        workload: "moderate",
      },
      {
        id: "4",
        name: "David Kim",
        email: "david.kim@company.com",
        avatar: "/avatars/david.jpg",
        role: "analyst",
        status: "away",
        expertise: ["malware_analysis", "reverse_engineering", "forensics"],
        activeThreats: 4,
        resolvedToday: 4,
        avgResponseTime: "20m",
        lastActive: "30 minutes ago",
        workload: "heavy",
      },
      {
        id: "5",
        name: "Lisa Park",
        email: "lisa.park@company.com",
        avatar: "/avatars/lisa.jpg",
        role: "senior_analyst",
        status: "online",
        expertise: ["behavioral_analysis", "user_profiling", "risk_assessment"],
        activeThreats: 6,
        resolvedToday: 2,
        avgResponseTime: "12m",
        lastActive: "10 minutes ago",
        workload: "heavy",
      },
      {
        id: "6",
        name: "James Wilson",
        email: "james.wilson@company.com",
        avatar: "/avatars/james.jpg",
        role: "analyst",
        status: "online",
        expertise: ["api_security", "authentication", "access_control"],
        activeThreats: 2,
        resolvedToday: 3,
        avgResponseTime: "18m",
        lastActive: "3 minutes ago",
        workload: "light",
      },
      {
        id: "7",
        name: "Anna Kowalski",
        email: "anna.kowalski@company.com",
        avatar: "/avatars/anna.jpg",
        role: "analyst",
        status: "offline",
        expertise: ["data_analysis", "pattern_recognition", "reporting"],
        activeThreats: 1,
        resolvedToday: 0,
        avgResponseTime: "25m",
        lastActive: "2 hours ago",
        workload: "light",
      },
      {
        id: "8",
        name: "Robert Taylor",
        email: "robert.taylor@company.com",
        avatar: "/avatars/robert.jpg",
        role: "admin",
        status: "online",
        expertise: ["system_administration", "security_architecture", "policy"],
        activeThreats: 0,
        resolvedToday: 1,
        avgResponseTime: "5m",
        lastActive: "15 minutes ago",
        workload: "light",
      },
    ])

    // Mock activities
    setActivities([
      {
        id: "1",
        type: "threat_resolved",
        description: "Resolved critical carding attack investigation",
        user: teamMembers[0] || ({} as TeamMember),
        timestamp: "2024-01-18T15:30:00Z",
        threatId: "THR-2024-001",
      },
      {
        id: "2",
        type: "evidence_uploaded",
        description: "Added network traffic analysis to investigation",
        user: teamMembers[1] || ({} as TeamMember),
        timestamp: "2024-01-18T15:15:00Z",
        threatId: "THR-2024-002",
      },
      {
        id: "3",
        type: "threat_assigned",
        description: "Assigned new phishing investigation to team",
        user: teamMembers[2] || ({} as TeamMember),
        timestamp: "2024-01-18T14:45:00Z",
        threatId: "THR-2024-003",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case "light":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "heavy":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "team_lead":
        return "bg-blue-100 text-blue-800"
      case "senior_analyst":
        return "bg-green-100 text-green-800"
      case "analyst":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Team Members</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalMembers}</div>
            <p className="text-xs text-green-600">{metrics.onlineMembers} online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Active Threats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.activeThreats}</div>
            <p className="text-xs text-blue-600">Being investigated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Resolved Today</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.resolvedToday}</div>
            <p className="text-xs text-green-600">+20% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Avg Response</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.avgResponseTime}</div>
            <p className="text-xs text-green-600">-15% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search team members..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}
                      ></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{member.name}</h4>
                        <Badge className={getRoleColor(member.role)}>{member.role.replace("_", " ")}</Badge>
                        <Badge className={getWorkloadColor(member.workload)}>{member.workload}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill.replace("_", " ")}
                          </Badge>
                        ))}
                        {member.expertise.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.expertise.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-orange-600">{member.activeThreats}</div>
                          <div className="text-xs text-gray-500">Active</div>
                        </div>
                        <div>
                          <div className="font-medium text-green-600">{member.resolvedToday}</div>
                          <div className="text-xs text-gray-500">Resolved</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Avg: {member.avgResponseTime}</div>
                      <div className="text-xs text-gray-500">{member.lastActive}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed & Team Stats */}
        <div className="space-y-6">
          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Team Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Team Efficiency</span>
                    <span>{metrics.teamEfficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${metrics.teamEfficiency}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Collaboration Score</span>
                    <span>{metrics.collaborationScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${metrics.collaborationScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">98.5%</div>
                  <div className="text-xs text-gray-500">SLA Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">4.8</div>
                  <div className="text-xs text-gray-500">Team Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <ActivityIcon className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {activity.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{activity.user.name}</span>
                          <span>•</span>
                          <span>{formatTimestamp(activity.timestamp)}</span>
                          {activity.threatId && (
                            <>
                              <span>•</span>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                {activity.threatId}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Team Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Send Team Alert
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Team Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Team Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
