"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  MessageSquare,
  Users,
  Clock,
  Eye,
  Flag,
  Share2,
  Download,
  Plus,
  Send,
  Paperclip,
  MoreHorizontal,
} from "lucide-react"

interface ThreatAnalysis {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "resolved" | "false_positive"
  assignedTo: TeamMember[]
  createdBy: TeamMember
  createdAt: string
  updatedAt: string
  description: string
  evidence: Evidence[]
  timeline: TimelineEvent[]
  comments: Comment[]
  tags: string[]
  riskScore: number
  confidence: number
  affectedAssets: string[]
  mitigationSteps: string[]
  relatedThreats: string[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  role: "analyst" | "senior_analyst" | "team_lead" | "admin"
  status: "online" | "away" | "offline"
  expertise: string[]
}

interface Evidence {
  id: string
  type: "screenshot" | "log" | "network_capture" | "file" | "url"
  title: string
  description: string
  uploadedBy: string
  uploadedAt: string
  size?: string
  url: string
}

interface TimelineEvent {
  id: string
  type: "created" | "assigned" | "status_changed" | "comment_added" | "evidence_added" | "escalated"
  description: string
  user: TeamMember
  timestamp: string
  metadata?: Record<string, any>
}

interface Comment {
  id: string
  content: string
  author: TeamMember
  timestamp: string
  mentions: string[]
  reactions: { emoji: string; users: string[] }[]
  attachments: string[]
}

export function ThreatAnalysisPanel({ threatId }: { threatId: string }) {
  const [analysis, setAnalysis] = useState<ThreatAnalysis | null>(null)
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        id: threatId,
        title: "Suspicious Carding Activity from Multiple IPs",
        severity: "critical",
        status: "investigating",
        assignedTo: [
          {
            id: "1",
            name: "Sarah Chen",
            email: "sarah.chen@company.com",
            avatar: "/avatars/sarah.jpg",
            role: "senior_analyst",
            status: "online",
            expertise: ["fraud_detection", "payment_security"],
          },
          {
            id: "2",
            name: "Mike Rodriguez",
            email: "mike.rodriguez@company.com",
            avatar: "/avatars/mike.jpg",
            role: "analyst",
            status: "online",
            expertise: ["network_analysis", "threat_hunting"],
          },
        ],
        createdBy: {
          id: "3",
          name: "AI Detection System",
          email: "system@company.com",
          avatar: "/avatars/system.jpg",
          role: "admin",
          status: "online",
          expertise: ["automated_detection"],
        },
        createdAt: "2024-01-18T14:30:00Z",
        updatedAt: "2024-01-18T15:45:00Z",
        description:
          "Multiple failed payment attempts detected from a coordinated network of IP addresses, indicating a potential carding attack targeting our payment infrastructure.",
        evidence: [
          {
            id: "1",
            type: "log",
            title: "Payment Gateway Logs",
            description: "Failed transaction attempts with different card numbers",
            uploadedBy: "system",
            uploadedAt: "2024-01-18T14:30:00Z",
            size: "2.3 MB",
            url: "/evidence/payment-logs.txt",
          },
          {
            id: "2",
            type: "network_capture",
            title: "Network Traffic Analysis",
            description: "Suspicious traffic patterns from multiple IPs",
            uploadedBy: "mike.rodriguez@company.com",
            uploadedAt: "2024-01-18T15:15:00Z",
            size: "15.7 MB",
            url: "/evidence/network-capture.pcap",
          },
        ],
        timeline: [
          {
            id: "1",
            type: "created",
            description: "Threat detected by AI system",
            user: {
              id: "3",
              name: "AI Detection System",
              email: "system@company.com",
              avatar: "/avatars/system.jpg",
              role: "admin",
              status: "online",
              expertise: ["automated_detection"],
            },
            timestamp: "2024-01-18T14:30:00Z",
          },
          {
            id: "2",
            type: "assigned",
            description: "Assigned to Sarah Chen and Mike Rodriguez",
            user: {
              id: "4",
              name: "Team Lead",
              email: "lead@company.com",
              avatar: "/avatars/lead.jpg",
              role: "team_lead",
              status: "online",
              expertise: ["team_management"],
            },
            timestamp: "2024-01-18T14:35:00Z",
          },
        ],
        comments: [
          {
            id: "1",
            content:
              "I'm seeing a pattern here - these IPs are all from the same ASN. Let me dig deeper into the network analysis.",
            author: {
              id: "2",
              name: "Mike Rodriguez",
              email: "mike.rodriguez@company.com",
              avatar: "/avatars/mike.jpg",
              role: "analyst",
              status: "online",
              expertise: ["network_analysis", "threat_hunting"],
            },
            timestamp: "2024-01-18T15:20:00Z",
            mentions: ["sarah.chen@company.com"],
            reactions: [{ emoji: "👍", users: ["sarah.chen@company.com"] }],
            attachments: [],
          },
        ],
        tags: ["carding", "payment_fraud", "coordinated_attack", "high_priority"],
        riskScore: 92,
        confidence: 87,
        affectedAssets: ["Payment Gateway", "Customer Database", "Transaction Processing"],
        mitigationSteps: [
          "Block identified IP addresses",
          "Implement rate limiting on payment endpoints",
          "Alert payment processor",
          "Monitor for similar patterns",
        ],
        relatedThreats: ["THR-2024-001", "THR-2024-003"],
      })
      setIsLoading(false)
    }, 1000)
  }, [threatId])

  const handleAddComment = () => {
    if (!newComment.trim() || !analysis) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        id: "current_user",
        name: "Current User",
        email: "user@company.com",
        avatar: "/avatars/current.jpg",
        role: "analyst",
        status: "online",
        expertise: ["threat_analysis"],
      },
      timestamp: new Date().toISOString(),
      mentions: [],
      reactions: [],
      attachments: [],
    }

    setAnalysis((prev) =>
      prev
        ? {
            ...prev,
            comments: [...prev.comments, comment],
          }
        : null,
    )
    setNewComment("")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "investigating":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "false_positive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Threat analysis not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-xl">{analysis.title}</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getSeverityColor(analysis.severity)}>{analysis.severity.toUpperCase()}</Badge>
                <Badge className={getStatusColor(analysis.status)}>
                  {analysis.status.replace("_", " ").toUpperCase()}
                </Badge>
                <Badge variant="outline">Risk: {analysis.riskScore}%</Badge>
                <Badge variant="outline">Confidence: {analysis.confidence}%</Badge>
              </div>
              <CardDescription>{analysis.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Details */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="mitigation">Mitigation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Threat Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created</label>
                      <p className="text-sm">{formatTimestamp(analysis.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-sm">{formatTimestamp(analysis.updatedAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created By</label>
                      <p className="text-sm">{analysis.createdBy.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Threat ID</label>
                      <p className="text-sm font-mono">{analysis.id}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Affected Assets</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.affectedAssets.map((asset, index) => (
                        <Badge key={index} variant="outline">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Related Threats</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {analysis.relatedThreats.map((threat, index) => (
                        <Button key={index} variant="link" size="sm" className="h-auto p-0">
                          {threat}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evidence" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Evidence & Artifacts</CardTitle>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Evidence
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.evidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{evidence.title}</h4>
                          <p className="text-sm text-gray-600">{evidence.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Uploaded by {evidence.uploadedBy}</span>
                            <span>{formatTimestamp(evidence.uploadedAt)}</span>
                            {evidence.size && <span>{evidence.size}</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Investigation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.timeline.map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{event.user.name}</span>
                            <span>•</span>
                            <span>{formatTimestamp(event.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mitigation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mitigation Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.mitigationSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">{index + 1}</span>
                        </div>
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Assigned Team</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.assignedTo.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role.replace("_", " ")}</p>
                    </div>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.status === "online"
                          ? "bg-green-500"
                          : member.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                Assign Member
              </Button>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Comments ({analysis.comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 mb-4">
                <div className="space-y-4">
                  {analysis.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {comment.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{comment.author.name}</p>
                            <p className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</p>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                          {comment.reactions.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {comment.reactions.map((reaction, index) => (
                                <Button key={index} variant="ghost" size="sm" className="h-6 px-2">
                                  <span className="text-xs">
                                    {reaction.emoji} {reaction.users.length}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
