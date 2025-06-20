"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Code,
  Key,
  Book,
  Copy,
  CheckCircle,
  Play,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Settings,
  Zap,
  Brain,
  MapPin,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Users,
  Lock,
  Download,
  ExternalLink,
  Search,
  Terminal,
  FileText,
  Star,
  HelpCircle,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import SmoothLink from "@/components/navigation/smooth-link"
import { EndpointSearch } from "@/components/api-docs/endpoint-search"
import { CodePlayground } from "@/components/api-docs/code-playground"
import { SDKGenerator } from "@/components/api-docs/sdk-generator"
import { APIAnalytics } from "@/components/api-docs/api-analytics"
import { Changelog } from "@/components/api-docs/changelog"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  requests: number
  status: "active" | "inactive"
  permissions: string[]
}

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  category: string
  parameters?: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  requestBody?: {
    type: string
    example: string
  }
  response: {
    type: string
    example: string
  }
  rateLimit?: string
  authentication: boolean
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: "POST",
    path: "/api/analyze",
    category: "Core Analysis",
    description: "Analyze IP addresses, emails, devices, or domains for fraud risk with AI-powered insights",
    authentication: true,
    rateLimit: "100 requests/minute",
    parameters: [
      {
        name: "input",
        type: "string",
        required: true,
        description: "The input to analyze (IP, email, device ID, or domain)",
      },
      {
        name: "type",
        type: "string",
        required: true,
        description: "Type of input: 'ip', 'email', 'device', or 'domain'",
      },
      {
        name: "options",
        type: "object",
        required: false,
        description: "Additional analysis options (deep_scan, ai_insights, geolocation)",
      },
    ],
    requestBody: {
      type: "application/json",
      example: JSON.stringify(
        {
          input: "192.168.1.100",
          type: "ip",
          options: {
            deep_scan: true,
            ai_insights: true,
            geolocation: true,
            device_fingerprinting: true,
          },
        },
        null,
        2,
      ),
    },
    response: {
      type: "application/json",
      example: JSON.stringify(
        {
          input: "192.168.1.100",
          type: "ip",
          riskScore: 75,
          confidence: 87,
          aiInsights: {
            summary: "Moderate risk IP with suspicious patterns",
            recommendations: [
              "Enable additional verification",
              "Monitor for unusual activity",
              "Consider rate limiting",
            ],
            threatCategories: ["VPN", "Suspicious Geolocation"],
            behaviorAnalysis: "Unusual login patterns detected",
          },
          location: {
            country: "United States",
            city: "New York",
            lat: 40.7128,
            lng: -74.006,
            accuracy: 95,
            isp: "Verizon Communications",
            timezone: "America/New_York",
          },
          deviceFingerprint: {
            os: "Windows 11",
            browser: "Chrome 120.0",
            device: "Desktop",
            screenResolution: "1920x1080",
            userAgent: "Mozilla/5.0...",
            plugins: ["Chrome PDF Plugin", "Native Client"],
            languages: ["en-US", "en"],
          },
          threats: [
            {
              type: "VPN Detection",
              severity: "medium",
              confidence: 85,
              description: "IP appears to be using VPN service",
            },
            {
              type: "Geolocation Anomaly",
              severity: "high",
              confidence: 92,
              description: "Login from unusual geographic location",
            },
          ],
          recommendations: [
            {
              action: "Enable MFA",
              priority: "high",
              reason: "High-risk login detected",
            },
            {
              action: "Monitor Session",
              priority: "medium",
              reason: "Unusual device characteristics",
            },
          ],
          metadata: {
            analysisTime: 245,
            timestamp: "2024-01-18T14:30:00Z",
            version: "2.1.0",
          },
        },
        null,
        2,
      ),
    },
  },
  {
    method: "GET",
    path: "/api/threats",
    category: "Threat Management",
    description: "Retrieve threat detections with advanced filtering and AI-powered insights",
    authentication: true,
    rateLimit: "200 requests/minute",
    parameters: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter by status: 'critical', 'high', 'medium', 'low', or 'all'",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "Maximum number of results to return (default: 10, max: 100)",
      },
      {
        name: "category",
        type: "string",
        required: false,
        description: "Filter by threat category: 'fraud', 'malware', 'phishing', 'bot'",
      },
      {
        name: "timeframe",
        type: "string",
        required: false,
        description: "Time range: '1h', '24h', '7d', '30d'",
      },
    ],
    response: {
      type: "application/json",
      example: JSON.stringify(
        {
          threats: [
            {
              id: "threat_1234567890",
              type: "Carding Attack",
              riskScore: 90,
              severity: "critical",
              transactionId: "txn_1234567890",
              timestamp: "2024-01-18T14:30:00Z",
              location: {
                country: "Unknown",
                city: "Tor Exit Node",
                coordinates: [0, 0],
              },
              aiAnalysis: {
                pattern: "Multiple rapid-fire payment attempts",
                similarity: 0.95,
                relatedThreats: ["threat_1234567889", "threat_1234567888"],
                predictedNextAction: "Account takeover attempt",
              },
              deviceInfo: {
                fingerprint: "fp_suspicious_device_001",
                spoofingDetected: true,
                riskFactors: ["Headless browser", "Automated behavior"],
              },
              status: "active",
              description: "Multiple failed payment attempts detected from suspicious device",
              affectedAssets: ["user_12345", "payment_gateway"],
              mitigationSteps: ["Block IP address", "Suspend user account", "Alert fraud team"],
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
          aiSummary: {
            trendAnalysis: "25% increase in carding attacks this week",
            riskLevel: "elevated",
            recommendations: [
              "Implement stricter rate limiting",
              "Enhance device fingerprinting",
              "Deploy behavioral analysis",
            ],
          },
        },
        null,
        2,
      ),
    },
  },
  {
    method: "POST",
    path: "/api/device/analyze",
    category: "Device Intelligence",
    description: "Advanced device fingerprinting and fraud detection with AI behavioral analysis",
    authentication: true,
    rateLimit: "50 requests/minute",
    requestBody: {
      type: "application/json",
      example: JSON.stringify(
        {
          deviceId: "device_1234567890",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          fingerprint: {
            screen: { width: 1920, height: 1080, colorDepth: 24 },
            timezone: "America/New_York",
            language: "en-US",
            plugins: ["Chrome PDF Plugin", "Native Client"],
            canvas: "canvas_hash_12345",
            webgl: "webgl_hash_67890",
          },
          behaviorData: {
            mouseMovements: [
              [100, 200],
              [150, 250],
              [200, 300],
            ],
            keystrokes: [{ key: "a", timestamp: 1642518000000 }],
            scrollPattern: "natural",
            clickPattern: "human-like",
          },
        },
        null,
        2,
      ),
    },
    response: {
      type: "application/json",
      example: JSON.stringify(
        {
          deviceId: "device_1234567890",
          riskScore: 35,
          confidence: 92,
          deviceType: "desktop",
          operatingSystem: "Windows 11",
          browser: "Chrome 120.0",
          aiAnalysis: {
            behaviorScore: 85,
            humanLikelihood: 0.92,
            botProbability: 0.08,
            spoofingIndicators: [],
            behaviorPattern: "Normal human interaction patterns detected",
          },
          riskFactors: [
            {
              factor: "New Device",
              severity: "low",
              description: "First time seeing this device fingerprint",
            },
          ],
          deviceIntelligence: {
            isVirtualMachine: false,
            isEmulator: false,
            isHeadlessBrowser: false,
            hasDevTools: false,
            screenSpoofing: false,
            timezoneMismatch: false,
          },
          geolocation: {
            country: "United States",
            region: "New York",
            city: "New York",
            accuracy: "high",
            vpnDetected: false,
            proxyDetected: false,
            torDetected: false,
          },
          recommendations: [
            {
              action: "Allow with monitoring",
              confidence: 0.85,
              reason: "Low risk device with normal behavior patterns",
            },
          ],
          metadata: {
            analysisVersion: "3.2.1",
            processingTime: 156,
            timestamp: "2024-01-18T14:30:00Z",
          },
        },
        null,
        2,
      ),
    },
  },
  {
    method: "GET",
    path: "/api/ai/insights",
    category: "AI Intelligence",
    description: "Get AI-powered insights and recommendations for fraud prevention",
    authentication: true,
    rateLimit: "30 requests/minute",
    parameters: [
      {
        name: "timeframe",
        type: "string",
        required: false,
        description: "Analysis timeframe: '1h', '24h', '7d', '30d'",
      },
      {
        name: "category",
        type: "string",
        required: false,
        description: "Insight category: 'trends', 'anomalies', 'predictions', 'recommendations'",
      },
    ],
    response: {
      type: "application/json",
      example: JSON.stringify(
        {
          insights: {
            threatTrends: {
              summary: "Significant increase in device spoofing attempts",
              change: "+45%",
              timeframe: "last 7 days",
              details: [
                "Mobile device emulation up 60%",
                "Headless browser detection up 30%",
                "Canvas fingerprint spoofing up 25%",
              ],
            },
            anomalies: [
              {
                type: "Geographic Anomaly",
                description: "Unusual spike in traffic from Eastern Europe",
                severity: "high",
                confidence: 0.89,
                affectedUsers: 1247,
                recommendation: "Implement geo-blocking for high-risk regions",
              },
              {
                type: "Behavioral Anomaly",
                description: "Automated behavior patterns detected",
                severity: "medium",
                confidence: 0.76,
                affectedSessions: 892,
                recommendation: "Deploy advanced bot detection",
              },
            ],
            predictions: {
              nextWeekThreatLevel: "elevated",
              expectedAttackVectors: ["Account takeover", "Payment fraud"],
              confidence: 0.82,
              preparationSteps: [
                "Increase monitoring sensitivity",
                "Prepare incident response team",
                "Review security policies",
              ],
            },
            recommendations: [
              {
                priority: "critical",
                category: "Security Enhancement",
                title: "Implement Advanced Device Fingerprinting",
                description: "Deploy machine learning-based device identification",
                impact: "Reduce false positives by 40%",
                effort: "medium",
                timeline: "2-3 weeks",
              },
              {
                priority: "high",
                category: "Process Improvement",
                title: "Automate Threat Response",
                description: "Set up automated blocking for high-confidence threats",
                impact: "Reduce response time by 85%",
                effort: "low",
                timeline: "1 week",
              },
            ],
          },
          metadata: {
            generatedAt: "2024-01-18T14:30:00Z",
            modelVersion: "gpt-4-turbo",
            dataPoints: 125000,
            analysisDepth: "comprehensive",
          },
        },
        null,
        2,
      ),
    },
  },
  {
    method: "POST",
    path: "/api/monitoring/realtime",
    category: "Real-time Monitoring",
    description: "Set up real-time monitoring for specific users, devices, or IP addresses",
    authentication: true,
    rateLimit: "20 requests/minute",
    requestBody: {
      type: "application/json",
      example: JSON.stringify(
        {
          monitoringType: "device",
          targetId: "device_1234567890",
          alertThreshold: 70,
          monitoringDuration: "24h",
          alertChannels: ["email", "webhook", "slack"],
          customRules: [
            {
              condition: "riskScore > 80",
              action: "immediate_alert",
            },
            {
              condition: "geolocation_change",
              action: "verify_user",
            },
          ],
        },
        null,
        2,
      ),
    },
    response: {
      type: "application/json",
      example: JSON.stringify(
        {
          monitoringId: "monitor_1234567890",
          status: "active",
          targetId: "device_1234567890",
          monitoringType: "device",
          alertThreshold: 70,
          expiresAt: "2024-01-19T14:30:00Z",
          alertChannels: ["email", "webhook", "slack"],
          customRules: [
            {
              ruleId: "rule_001",
              condition: "riskScore > 80",
              action: "immediate_alert",
              status: "active",
            },
          ],
          currentStatus: {
            lastCheck: "2024-01-18T14:30:00Z",
            currentRiskScore: 35,
            alertsTriggered: 0,
            monitoringHealth: "healthy",
          },
        },
        null,
        2,
      ),
    },
  },
]

const categories = [
  "All",
  "Core Analysis",
  "Threat Management",
  "Device Intelligence",
  "AI Intelligence",
  "Real-time Monitoring",
]

export default function APIDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint>(apiEndpoints[0])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "sk_live_1234567890abcdef",
      created: "2024-01-15",
      lastUsed: "2024-01-18",
      requests: 15420,
      status: "active",
      permissions: ["read", "write", "admin"],
    },
    {
      id: "2",
      name: "Development API Key",
      key: "sk_test_abcdef1234567890",
      created: "2024-01-10",
      lastUsed: "2024-01-17",
      requests: 8932,
      status: "active",
      permissions: ["read", "write"],
    },
  ])
  const [newKeyName, setNewKeyName] = useState("")
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [testInput, setTestInput] = useState("")
  const [testResponse, setTestResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [favoriteEndpoints, setFavoriteEndpoints] = useState<string[]>([])
  const [apiUsageStats, setApiUsageStats] = useState({
    todayRequests: 24567,
    successRate: 99.9,
    avgResponseTime: 145,
    threatsBlocked: 1247,
  })
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const filteredEndpoints =
    selectedCategory === "All"
      ? apiEndpoints
      : apiEndpoints.filter((endpoint) => endpoint.category === selectedCategory)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const testEndpoint = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setTestResponse(selectedEndpoint.response.example)
    } catch (error) {
      setTestResponse(JSON.stringify({ error: "API call failed" }, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200"
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PUT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const createApiKey = () => {
    if (!newKeyName.trim()) return

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      requests: 0,
      status: "active",
      permissions: ["read", "write"],
    }

    setApiKeys([...apiKeys, newKey])
    setNewKeyName("")
  }

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleFavorite = (endpointPath: string) => {
    setFavoriteEndpoints((prev) =>
      prev.includes(endpointPath) ? prev.filter((path) => path !== endpointPath) : [...prev, endpointPath],
    )
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const filteredEndpointsBySearch = (filteredEndpoints as any).filter(
    (endpoint) =>
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SmoothLink href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard AI</span>
            </SmoothLink>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              API Documentation
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Docs
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
            <nav className="space-y-1">
              <SmoothLink href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </SmoothLink>
              <SmoothLink href="/device-analysis">
                <Button variant="ghost" className="w-full justify-start">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Device Analysis
                </Button>
              </SmoothLink>
              <Button variant="ghost" className="w-full justify-start bg-orange-50 text-orange-700">
                <Book className="mr-2 h-4 w-4" />
                API Documentation
              </Button>
              <SmoothLink href="/collaboration">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Team Collaboration
                </Button>
              </SmoothLink>
              <SmoothLink href="/upgrade">
                <Button variant="ghost" className="w-full justify-start">
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </SmoothLink>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">API Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a
                href="#getting-started"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                Getting Started
              </a>
              <a
                href="#authentication"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Lock className="h-3 w-3 mr-2" />
                Authentication
              </a>
              <a
                href="#rate-limits"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <TrendingUp className="h-3 w-3 mr-2" />
                Rate Limits
              </a>
              <a
                href="#ai-insights"
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <Brain className="h-3 w-3 mr-2" />
                AI Insights
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">API Documentation</h1>
            <p className="text-lg text-gray-600 mb-4">
              Integrate Sureguard AI's advanced fraud detection and device monitoring into your applications
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                API Status: Operational
              </Badge>
              <Badge variant="outline">Version 2.1.0</Badge>
              <Badge variant="outline">99.9% Uptime</Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="playground">Playground</TabsTrigger>
              <TabsTrigger value="sdk">SDK</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Start Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span>Quick Start Guide</span>
                  </CardTitle>
                  <CardDescription>Get up and running with Sureguard AI in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Key className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold mb-2">1. Get API Key</h3>
                      <p className="text-sm text-gray-600">Create your API key in the API Keys tab</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Code className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">2. Make API Call</h3>
                      <p className="text-sm text-gray-600">Send your first request to analyze threats</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Brain className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">3. Get AI Insights</h3>
                      <p className="text-sm text-gray-600">Receive intelligent fraud detection results</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* API Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>AI-Powered Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Advanced device fingerprinting</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Behavioral analysis and bot detection</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Real-time risk scoring</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Intelligent threat predictions</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>Real-time Monitoring</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Live geolocation tracking</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">VPN/Proxy/Tor detection</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Device spoofing detection</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Automated threat response</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>API Usage Overview</CardTitle>
                  <CardDescription>Your current API usage and limits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">24,567</div>
                      <div className="text-sm text-gray-600">API Calls Today</div>
                      <Progress value={65} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">99.9%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                      <Progress value={99.9} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">145ms</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                      <Progress value={85} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">1,247</div>
                      <div className="text-sm text-gray-600">Threats Blocked</div>
                      <Progress value={78} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="getting-started" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with Sureguard AI API</CardTitle>
                  <CardDescription>
                    Follow this comprehensive guide to integrate fraud detection into your application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1: Authentication */}
                  <div id="authentication">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        1
                      </div>
                      Authentication Setup
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        All API requests require authentication using your API key in the Authorization header:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <code className="text-green-400 text-sm">
                          curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;https://api.sureguard.ai/v1/analyze
                        </code>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Basic Analysis */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        2
                      </div>
                      Your First API Call
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-3">
                        Start with a simple IP analysis to detect potential threats:
                      </p>
                      <Tabs defaultValue="curl" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="curl">cURL</TabsTrigger>
                          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                          <TabsTrigger value="python">Python</TabsTrigger>
                          <TabsTrigger value="php">PHP</TabsTrigger>
                        </TabsList>

                        <TabsContent value="curl">
                          <div className="bg-gray-900 rounded-lg p-4">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              {`curl -X POST https://api.sureguard.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "192.168.1.100",
    "type": "ip",
    "options": {
      "ai_insights": true,
      "geolocation": true
    }
  }'`}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="javascript">
                          <div className="bg-gray-900 rounded-lg p-4">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              {`const response = await fetch('https://api.sureguard.ai/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    input: '192.168.1.100',
    type: 'ip',
    options: {
      ai_insights: true,
      geolocation: true
    }
  })
});

const data = await response.json();
console.log('Risk Score:', data.riskScore);
console.log('AI Insights:', data.aiInsights);`}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="python">
                          <div className="bg-gray-900 rounded-lg p-4">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              {`import requests

url = "https://api.sureguard.ai/v1/analyze"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "input": "192.168.1.100",
    "type": "ip",
    "options": {
        "ai_insights": True,
        "geolocation": True
    }
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

print(f"Risk Score: {result['riskScore']}")
print(f"AI Insights: {result['aiInsights']['summary']}")`}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="php">
                          <div className="bg-gray-900 rounded-lg p-4">
                            <pre className="text-green-400 text-sm overflow-x-auto">
                              {`<?php
$url = 'https://api.sureguard.ai/v1/analyze';
$data = [
    'input' => '192.168.1.100',
    'type' => 'ip',
    'options' => [
        'ai_insights' => true,
        'geolocation' => true
    ]
];

$options = [
    'http' => [
        'header' => [
            'Authorization: Bearer YOUR_API_KEY',
            'Content-Type: application/json'
        ],
        'method' => 'POST',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

echo "Risk Score: " . $response['riskScore'] . "\\n";
echo "AI Summary: " . $response['aiInsights']['summary'] . "\\n";
?>`}
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>

                  {/* Step 3: Advanced Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        3
                      </div>
                      Advanced Device Analysis
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        For comprehensive device fraud detection, include behavioral data and device fingerprinting:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
                          {`{
  "deviceId": "device_1234567890",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "fingerprint": {
    "screen": { "width": 1920, "height": 1080 },
    "timezone": "America/New_York",
    "language": "en-US",
    "canvas": "canvas_hash_12345"
  },
  "behaviorData": {
    "mouseMovements": [[100, 200], [150, 250]],
    "keystrokes": [{"key": "a", "timestamp": 1642518000000}],
    "scrollPattern": "natural"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Real-time Monitoring */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm mr-3">
                        4
                      </div>
                      Set Up Real-time Monitoring
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700 mb-3">
                        Enable continuous monitoring for high-risk users or devices:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-green-400 text-sm overflow-x-auto">
                          {`POST /api/monitoring/realtime
{
  "monitoringType": "device",
  "targetId": "device_1234567890",
  "alertThreshold": 70,
  "monitoringDuration": "24h",
  "alertChannels": ["email", "webhook"],
  "customRules": [
    {
      "condition": "riskScore > 80",
      "action": "immediate_alert"
    }
  ]
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Best Practices */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span>Best Practices</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-700">✅ Do</h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Always include device fingerprinting data</li>
                            <li>• Use HTTPS for all API calls</li>
                            <li>• Implement proper error handling</li>
                            <li>• Cache results when appropriate</li>
                            <li>• Monitor your API usage limits</li>
                            <li>• Use webhooks for real-time alerts</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-red-700">❌ Don't</h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Expose API keys in client-side code</li>
                            <li>• Make unnecessary API calls</li>
                            <li>• Ignore rate limiting responses</li>
                            <li>• Skip input validation</li>
                            <li>• Store sensitive data unnecessarily</li>
                            <li>• Use deprecated API versions</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span>Best Practices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700">✅ Do</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Always include device fingerprinting data</li>
                        <li>• Use HTTPS for all API calls</li>
                        <li>• Implement proper error handling</li>
                        <li>• Cache results when appropriate</li>
                        <li>• Monitor your API usage limits</li>
                        <li>• Use webhooks for real-time alerts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700">❌ Don't</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Expose API keys in client-side code</li>
                        <li>• Make unnecessary API calls</li>
                        <li>• Ignore rate limiting responses</li>
                        <li>• Skip input validation</li>
                        <li>• Store sensitive data unnecessarily</li>
                        <li>• Use deprecated API versions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>API Key Management</span>
                  </CardTitle>
                  <CardDescription>Create and manage your API keys for secure access to Sureguard AI</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Create New API Key */}
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-3">Create New API Key</h3>
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Enter API key name (e.g., Production, Development)"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={createApiKey} disabled={!newKeyName.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Key
                      </Button>
                    </div>
                  </div>

                  {/* API Keys List */}
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{apiKey.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Created: {apiKey.created}</span>
                              <span>Last used: {apiKey.lastUsed}</span>
                              <span>{apiKey.requests.toLocaleString()} requests</span>
                              <Badge
                                variant={apiKey.status === "active" ? "default" : "secondary"}
                                className={apiKey.status === "active" ? "bg-green-100 text-green-800" : ""}
                              >
                                {apiKey.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                              {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key)}>
                              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteApiKey(apiKey.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="bg-gray-900 rounded-lg p-3 mb-3">
                          <code className="text-green-400 text-sm">
                            {showKeys[apiKey.id]
                              ? apiKey.key
                              : apiKey.key.substring(0, 12) + "..." + apiKey.key.substring(apiKey.key.length - 4)}
                          </code>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="font-medium">Permissions: </span>
                            {apiKey.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="ml-1">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* API Key Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    <span>Security Guidelines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-700">Secure Practices</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Store API keys in environment variables</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Use different keys for different environments</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Rotate keys regularly</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>Monitor API key usage</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-red-700">Avoid These Mistakes</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <span>Never commit API keys to version control</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <span>Don't use production keys in development</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <span>Avoid sharing keys via email or chat</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <span>Don't expose keys in client-side code</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Endpoints List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Endpoints</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex items-center space-x-2">
                      <Search className="h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search endpoints..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {filteredEndpointsBySearch.map((endpoint, index) => (
                          <Button
                            key={index}
                            variant={selectedEndpoint === endpoint ? "default" : "ghost"}
                            className="w-full justify-start text-left p-3 h-auto"
                            onClick={() => setSelectedEndpoint(endpoint)}
                          >
                            <div className="flex flex-col items-start space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getMethodColor(endpoint.method)} text-xs`}>
                                  {endpoint.method}
                                </Badge>
                                {endpoint.authentication && <Lock className="h-3 w-3 text-gray-500" />}
                              </div>
                              <span className="text-xs font-mono truncate w-full">{endpoint.path}</span>
                              <span className="text-xs text-gray-600">{endpoint.category}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Endpoint Documentation */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Badge className={getMethodColor(selectedEndpoint.method)}>{selectedEndpoint.method}</Badge>
                      <span className="font-mono">{selectedEndpoint.path}</span>
                      {selectedEndpoint.authentication && <Lock className="h-4 w-4 text-gray-500" />}
                    </CardTitle>
                    <CardDescription>{selectedEndpoint.description}</CardDescription>
                    {selectedEndpoint.rateLimit && (
                      <Badge variant="outline" className="w-fit">
                        Rate limit: {selectedEndpoint.rateLimit}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="test">Test API</TabsTrigger>
                        <TabsTrigger value="examples">Examples</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-6">
                        {/* Authentication */}
                        {selectedEndpoint.authentication && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 mb-2">
                                Include your API key in the Authorization header:
                              </p>
                              <div className="flex items-center space-x-2">
                                <code className="bg-white px-2 py-1 rounded text-sm flex-1">
                                  Authorization: Bearer YOUR_API_KEY
                                </code>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => copyToClipboard(`Authorization: Bearer YOUR_API_KEY`)}
                                >
                                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Parameters */}
                        {selectedEndpoint.parameters && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Parameters</h3>
                            <div className="space-y-3">
                              {selectedEndpoint.parameters.map((param, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{param.name}</code>
                                    <Badge variant={param.required ? "default" : "secondary"}>
                                      {param.required ? "Required" : "Optional"}
                                    </Badge>
                                    <Badge variant="outline">{param.type}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">{param.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {selectedEndpoint.requestBody && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Request Body</h3>
                            <div className="bg-gray-900 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-white border-gray-600">
                                  {selectedEndpoint.requestBody.type}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-white border-gray-600"
                                  onClick={() => copyToClipboard(selectedEndpoint.requestBody!.example)}
                                >
                                  {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                              </div>
                              <ScrollArea className="h-64">
                                <pre className="text-green-400 text-sm">{selectedEndpoint.requestBody.example}</pre>
                              </ScrollArea>
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Response</h3>
                          <div className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-white border-gray-600">
                                {selectedEndpoint.response.type}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-white border-gray-600"
                                onClick={() => copyToClipboard(selectedEndpoint.response.example)}
                              >
                                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <ScrollArea className="h-64">
                              <pre className="text-green-400 text-sm">{selectedEndpoint.response.example}</pre>
                            </ScrollArea>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="test" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Test API Endpoint</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">API Key</label>
                              <Input
                                value={apiKeys[0]?.key || ""}
                                readOnly
                                placeholder="Select an API key from the API Keys tab"
                              />
                            </div>

                            {selectedEndpoint.requestBody && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Request Body</label>
                                <Textarea
                                  value={testInput || selectedEndpoint.requestBody.example}
                                  onChange={(e) => setTestInput(e.target.value)}
                                  rows={12}
                                  className="font-mono text-sm"
                                />
                              </div>
                            )}

                            <Button onClick={testEndpoint} disabled={isLoading} className="w-full">
                              {isLoading ? (
                                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                              ) : (
                                <Play className="h-4 w-4 mr-2" />
                              )}
                              {isLoading ? "Testing..." : "Send Request"}
                            </Button>

                            {testResponse && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Response</label>
                                <div className="bg-gray-900 rounded-lg p-4">
                                  <ScrollArea className="h-64">
                                    <pre className="text-green-400 text-sm">{testResponse}</pre>
                                  </ScrollArea>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="examples" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Code Examples</h3>
                          <Tabs defaultValue="curl" className="space-y-4">
                            <TabsList>
                              <TabsTrigger value="curl">cURL</TabsTrigger>
                              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                              <TabsTrigger value="python">Python</TabsTrigger>
                              <TabsTrigger value="php">PHP</TabsTrigger>
                            </TabsList>

                            <TabsContent value="curl">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm">cURL</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white border-gray-600"
                                    onClick={() =>
                                      copyToClipboard(`curl -X ${selectedEndpoint.method} \\
  https://api.sureguard.ai${selectedEndpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  ${selectedEndpoint.requestBody ? `-d '${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}'` : ""}`)
                                    }
                                  >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <ScrollArea className="h-32">
                                  <pre className="text-green-400 text-sm">
                                    {`curl -X ${selectedEndpoint.method} \\
  https://api.sureguard.ai${selectedEndpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\${
    selectedEndpoint.requestBody
      ? `
  -d '${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}'`
      : ""
  }`}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </TabsContent>

                            <TabsContent value="javascript">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm">JavaScript (fetch)</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white border-gray-600"
                                    onClick={() =>
                                      copyToClipboard(`const response = await fetch('https://api.sureguard.ai${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },${
    selectedEndpoint.requestBody
      ? `
  body: JSON.stringify(${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}),`
      : ""
  }
});

const data = await response.json();
console.log(data);`)
                                    }
                                  >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <ScrollArea className="h-48">
                                  <pre className="text-green-400 text-sm">
                                    {`const response = await fetch('https://api.sureguard.ai${selectedEndpoint.path}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },${
    selectedEndpoint.requestBody
      ? `
  body: JSON.stringify(${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}),`
      : ""
  }
});

const data = await response.json();
console.log(data);`}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </TabsContent>

                            <TabsContent value="python">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm">Python (requests)</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white border-gray-600"
                                    onClick={() =>
                                      copyToClipboard(`import requests

url = "https://api.sureguard.ai${selectedEndpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}${
                                        selectedEndpoint.requestBody
                                          ? `
data = ${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers, json=data)`
                                          : `

response = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers)`
                                      }
print(response.json())`)
                                    }
                                  >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <ScrollArea className="h-48">
                                  <pre className="text-green-400 text-sm">
                                    {`import requests

url = "https://api.sureguard.ai${selectedEndpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}${
                                      selectedEndpoint.requestBody
                                        ? `
data = ${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers, json=data)`
                                        : `

response = requests.${selectedEndpoint.method.toLowerCase()}(url, headers=headers)`
                                    }
print(response.json())`}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </TabsContent>

                            <TabsContent value="php">
                              <div className="bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm">PHP</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-white border-gray-600"
                                    onClick={() =>
                                      copyToClipboard(`<?php
$url = 'https://api.sureguard.ai${selectedEndpoint.path}';
$headers = [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
];${
                                        selectedEndpoint.requestBody
                                          ? `
$data = '${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}';

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${selectedEndpoint.method}',
        'content' => $data
    ]
];`
                                          : `

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${selectedEndpoint.method}'
    ]
];`
                                      }

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

print_r($response);
?>`)
                                    }
                                  >
                                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <ScrollArea className="h-48">
                                  <pre className="text-green-400 text-sm">
                                    {`<?php
$url = 'https://api.sureguard.ai${selectedEndpoint.path}';
$headers = [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
];${
                                      selectedEndpoint.requestBody
                                        ? `
$data = '${selectedEndpoint.requestBody.example.replace(/\n/g, "").replace(/\s+/g, " ")}';

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${selectedEndpoint.method}',
        'content' => $data
    ]
];`
                                        : `

$options = [
    'http' => [
        'header' => implode("\\r\\n", $headers),
        'method' => '${selectedEndpoint.method}'
    ]
];`
                                    }

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$response = json_decode($result, true);

print_r($response);
?>`}
                                  </pre>
                                </ScrollArea>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="playground" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive API Playground</h2>
                <p className="text-gray-600">Test API endpoints with real-time code generation and execution</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Select Endpoint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EndpointSearch
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      selectedTags={selectedTags}
                      onTagsChange={setSelectedTags}
                      availableTags={categories.slice(1)}
                    />
                    <div className="mt-4 space-y-2">
                      {filteredEndpointsBySearch.map((endpoint, index) => (
                        <Button
                          key={index}
                          variant={selectedEndpoint === endpoint ? "default" : "ghost"}
                          className="w-full justify-start text-left p-3 h-auto"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <div className="flex items-center space-x-2">
                            <Badge className={getMethodColor(endpoint.method)}>{endpoint.method}</Badge>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleFavorite(endpoint.path)
                              }}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              <Star
                                className={`h-4 w-4 ${favoriteEndpoints.includes(endpoint.path) ? "fill-yellow-500 text-yellow-500" : ""}`}
                              />
                            </button>
                          </div>
                          <div className="text-xs font-mono truncate">{endpoint.path}</div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-3">
                  <CodePlayground endpoint={selectedEndpoint} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sdk" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">SDK Libraries</h2>
                <p className="text-gray-600">Download official SDK libraries for easy integration</p>
              </div>

              <SDKGenerator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Terminal className="h-5 w-5 text-green-600" />
                      <span>Installation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm install sureguard-ai-sdk</code>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Python</h4>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">pip install sureguard-ai</code>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">PHP</h4>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">composer require sureguard/ai-sdk</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>Documentation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm text-blue-600 hover:underline">
                        JavaScript SDK Docs
                      </a>
                      <a href="#" className="block text-sm text-blue-600 hover:underline">
                        Python SDK Docs
                      </a>
                      <a href="#" className="block text-sm text-blue-600 hover:underline">
                        PHP SDK Docs
                      </a>
                      <a href="#" className="block text-sm text-blue-600 hover:underline">
                        API Reference
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5 text-purple-600" />
                      <span>Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <a href="#" className="block text-sm text-purple-600 hover:underline">
                        GitHub Issues
                      </a>
                      <a href="#" className="block text-sm text-purple-600 hover:underline">
                        Stack Overflow
                      </a>
                      <a href="#" className="block text-sm text-purple-600 hover:underline">
                        Discord Community
                      </a>
                      <a href="#" className="block text-sm text-purple-600 hover:underline">
                        Email Support
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Analytics</h2>
                <p className="text-gray-600">Monitor your API usage, performance, and threat detection metrics</p>
              </div>

              <APIAnalytics />
            </TabsContent>

            <TabsContent value="changelog" className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Changelog</h2>
                <p className="text-gray-600">Stay updated with the latest API changes and improvements</p>
              </div>

              <Changelog />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6" id="rate-limits">
              {/* Rate Limits & Status Codes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span>Rate Limits</span>
                    </CardTitle>
                    <CardDescription>API usage limits and guidelines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">Free Tier</span>
                          <p className="text-sm text-gray-600">Basic fraud detection</p>
                        </div>
                        <Badge variant="outline">1,000 requests/hour</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <span className="font-medium">Professional</span>
                          <p className="text-sm text-gray-600">Advanced AI insights</p>
                        </div>
                        <Badge variant="outline">10,000 requests/hour</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <div>
                          <span className="font-medium">Enterprise</span>
                          <p className="text-sm text-gray-600">Custom solutions</p>
                        </div>
                        <Badge variant="outline">Unlimited</Badge>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Rate Limit Headers</h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <code>X-RateLimit-Limit</code>: Request limit per hour
                        </div>
                        <div>
                          <code>X-RateLimit-Remaining</code>: Remaining requests
                        </div>
                        <div>
                          <code>X-RateLimit-Reset</code>: Reset time (Unix timestamp)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span>Status Codes</span>
                    </CardTitle>
                    <CardDescription>HTTP response codes and their meanings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800 border-green-200">200</Badge>
                        <span className="text-sm">Success - Request completed successfully</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">201</Badge>
                        <span className="text-sm">Created - Resource created successfully</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">400</Badge>
                        <span className="text-sm">Bad Request - Invalid parameters or request body</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-red-100 text-red-800 border-red-200">401</Badge>
                        <span className="text-sm">Unauthorized - Invalid or missing API key</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-red-100 text-red-800 border-red-200">403</Badge>
                        <span className="text-sm">Forbidden - Insufficient permissions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-red-100 text-red-800 border-red-200">429</Badge>
                        <span className="text-sm">Rate Limited - Too many requests</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-red-100 text-red-800 border-red-200">500</Badge>
                        <span className="text-sm">Server Error - Internal server error</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* API Health & Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>API Health & Monitoring</span>
                  </CardTitle>
                  <CardDescription>Real-time API status and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">145ms</div>
                      <div className="text-sm text-gray-600">Avg Response</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">2.4M</div>
                      <div className="text-sm text-gray-600">Requests/Day</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">99.8%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "99.8%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Status Page</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Monitor real-time API status and subscribe to updates at our status page.
                    </p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Status Page
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Webhooks */}
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>Receive real-time notifications for important events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Threat Detection Webhook</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Receive immediate notifications when high-risk threats are detected
                      </p>
                      <div className="bg-gray-900 rounded p-3">
                        <code className="text-green-400 text-sm">
                          {`POST https://your-app.com/webhooks/threat-detected
{
  "event": "threat.detected",
  "data": {
    "threatId": "threat_1234567890",
    "riskScore": 95,
    "severity": "critical",
    "timestamp": "2024-01-18T14:30:00Z"
  }
}`}
                        </code>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Device Analysis Webhook</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Get notified when device analysis reveals suspicious activity
                      </p>
                      <div className="bg-gray-900 rounded p-3">
                        <code className="text-green-400 text-sm">
                          {`POST https://your-app.com/webhooks/device-analysis
{
  "event": "device.suspicious",
  "data": {
    "deviceId": "device_1234567890",
    "riskScore": 85,
    "indicators": ["bot_behavior", "device_spoofing"],
    "timestamp": "2024-01-18T14:30:00Z"
  }
}`}
                        </code>
                      </div>
                    </div>
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
