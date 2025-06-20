// Mock WebSocket server for development
// Run with: node server/websocket-server.js

const WebSocket = require("ws")

const wss = new WebSocket.Server({ port: 3001 })

console.log("WebSocket server started on ws://localhost:3001")

// Store connected clients
const clients = new Set()

// Threat event types
const threatTypes = [
  {
    type: "threat_detected",
    threatType: "Carding Attack",
    severities: ["high", "critical"],
    locations: ["Unknown", "Russia", "China", "Nigeria"],
  },
  {
    type: "ip_blocked",
    threatType: "Malicious IP",
    severities: ["medium", "high"],
    locations: ["Russia", "China", "North Korea", "Iran"],
  },
  {
    type: "device_flagged",
    threatType: "Device Spoofing",
    severities: ["medium", "high"],
    locations: ["Unknown", "Various"],
  },
  {
    type: "user_suspended",
    threatType: "Account Takeover",
    severities: ["high", "critical"],
    locations: ["Nigeria", "Romania", "Brazil"],
  },
  {
    type: "system_alert",
    threatType: "System Anomaly",
    severities: ["low", "medium"],
    locations: ["Internal"],
  },
]

// Generate random threat event
function generateThreatEvent() {
  const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)]
  const severity = threat.severities[Math.floor(Math.random() * threat.severities.length)]
  const location = threat.locations[Math.floor(Math.random() * threat.locations.length)]

  return {
    id: "evt_" + Math.random().toString(36).substr(2, 9),
    type: threat.type,
    severity: severity,
    timestamp: new Date().toISOString(),
    data: {
      threatType: threat.threatType,
      riskScore: Math.floor(Math.random() * 100),
      location: location,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      deviceId: threat.type === "device_flagged" ? "dev_" + Math.random().toString(36).substr(2, 9) : undefined,
      userId: threat.type === "user_suspended" ? "user_" + Math.random().toString(36).substr(2, 9) : undefined,
      description: getDescription(threat.threatType, severity),
      metadata: {
        source: "ai_detection",
        confidence: 0.7 + Math.random() * 0.3,
        processed_at: new Date().toISOString(),
      },
    },
  }
}

function getDescription(threatType, severity) {
  const descriptions = {
    "Carding Attack": [
      "Multiple failed payment attempts detected from suspicious IP",
      "Automated card testing detected across multiple merchants",
      "High-velocity transaction attempts with different card numbers",
    ],
    "Malicious IP": [
      "IP address flagged in threat intelligence feeds",
      "Suspicious activity patterns detected from this IP",
      "IP associated with known botnet infrastructure",
    ],
    "Device Spoofing": [
      "Device fingerprint inconsistencies detected",
      "Suspicious device characteristics identified",
      "Potential device emulation or spoofing detected",
    ],
    "Account Takeover": [
      "Unusual login patterns detected for user account",
      "Login from new device without proper verification",
      "Multiple failed authentication attempts followed by success",
    ],
    "System Anomaly": [
      "Unusual system behavior detected",
      "Performance metrics outside normal parameters",
      "Potential system compromise indicators found",
    ],
  }

  const typeDescriptions = descriptions[threatType] || ["Unknown threat detected"]
  return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)]
}

// Broadcast to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data)
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// Handle new connections
wss.on("connection", (ws) => {
  console.log("New client connected. Total clients:", clients.size + 1)
  clients.add(ws)

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection",
      message: "Connected to SureGuard WebSocket server",
      timestamp: new Date().toISOString(),
    }),
  )

  // Handle messages from client
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      console.log("Received message:", data)

      if (data.type === "auth") {
        ws.send(
          JSON.stringify({
            type: "auth_success",
            message: "Authentication successful",
            timestamp: new Date().toISOString(),
          }),
        )
      }

      if (data.type === "ping") {
        ws.send(
          JSON.stringify({
            type: "pong",
            timestamp: new Date().toISOString(),
          }),
        )
      }
    } catch (error) {
      console.error("Error parsing message:", error)
    }
  })

  // Handle client disconnect
  ws.on("close", () => {
    console.log("Client disconnected. Total clients:", clients.size - 1)
    clients.delete(ws)
  })

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
    clients.delete(ws)
  })
})

// Send periodic threat events
setInterval(
  () => {
    if (clients.size > 0) {
      const event = generateThreatEvent()
      console.log("Broadcasting threat event:", event.type, event.severity)
      broadcast(event)
    }
  },
  3000 + Math.random() * 4000,
) // Random interval between 3-7 seconds

// Send periodic system stats
setInterval(() => {
  if (clients.size > 0) {
    broadcast({
      type: "system_stats",
      timestamp: new Date().toISOString(),
      data: {
        activeConnections: clients.size,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        threatsProcessed: Math.floor(Math.random() * 1000) + 5000,
      },
    })
  }
}, 30000) // Every 30 seconds

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server...")
  wss.close(() => {
    console.log("WebSocket server closed")
    process.exit(0)
  })
})
