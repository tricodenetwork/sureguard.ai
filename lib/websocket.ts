"use client"

import { useEffect, useRef, useState, useCallback } from "react"

export interface ThreatEvent {
  id: string
  type: "threat_detected" | "ip_blocked" | "device_flagged" | "user_suspended" | "system_alert"
  severity: "low" | "medium" | "high" | "critical"
  timestamp: string
  data: {
    threatType?: string
    riskScore?: number
    location?: string
    ip?: string
    deviceId?: string
    userId?: string
    description: string
    metadata?: Record<string, any>
  }
}

export interface WebSocketState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  lastMessage: ThreatEvent | null
  connectionCount: number
}

export function useWebSocket(url = "ws://localhost:3001/ws") {
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    connectionCount: 0,
  })

  const [messages, setMessages] = useState<ThreatEvent[]>([])
  const [subscribers, setSubscribers] = useState<Map<string, (event: ThreatEvent) => void>>(new Map())

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        console.log("WebSocket connected")
        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          connectionCount: prev.connectionCount + 1,
        }))

        // Send authentication if needed
        ws.current?.send(
          JSON.stringify({
            type: "auth",
            token: localStorage.getItem("auth_token") || "demo_token",
          }),
        )
      }

      ws.current.onmessage = (event) => {
        try {
          const threatEvent: ThreatEvent = JSON.parse(event.data)

          setState((prev) => ({ ...prev, lastMessage: threatEvent }))
          setMessages((prev) => [threatEvent, ...prev.slice(0, 99)]) // Keep last 100 messages

          // Notify subscribers
          subscribers.forEach((callback) => callback(threatEvent))
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: event.code !== 1000 ? `Connection closed: ${event.reason}` : null,
        }))

        // Auto-reconnect after 3 seconds if not a normal closure
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, 3000)
        }
      }

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setState((prev) => ({
          ...prev,
          error: "WebSocket connection error",
          isConnecting: false,
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to create WebSocket connection",
        isConnecting: false,
      }))
    }
  }, [url, subscribers])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (ws.current) {
      ws.current.close(1000, "Manual disconnect")
      ws.current = null
    }
  }, [])

  const subscribe = useCallback((id: string, callback: (event: ThreatEvent) => void) => {
    setSubscribers((prev) => new Map(prev.set(id, callback)))

    return () => {
      setSubscribers((prev) => {
        const newMap = new Map(prev)
        newMap.delete(id)
        return newMap
      })
    }
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    ...state,
    messages,
    connect,
    disconnect,
    subscribe,
    sendMessage,
  }
}

// Mock WebSocket server simulation for demo
export class MockWebSocketServer {
  private clients: Set<WebSocket> = new Set()
  private intervalId: NodeJS.Timeout | null = null

  start() {
    // Simulate real-time threat events
    this.intervalId = setInterval(
      () => {
        this.broadcastThreatEvent()
      },
      2000 + Math.random() * 3000,
    ) // Random interval between 2-5 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private broadcastThreatEvent() {
    const threats = [
      {
        type: "threat_detected",
        threatType: "Carding Attack",
        riskScore: 90,
        location: "Unknown",
        ip: "203.0.113." + Math.floor(Math.random() * 255),
        description: "Multiple failed payment attempts detected from suspicious IP",
      },
      {
        type: "ip_blocked",
        threatType: "Malicious IP",
        riskScore: 85,
        location: "Russia",
        ip: "198.51.100." + Math.floor(Math.random() * 255),
        description: "IP address automatically blocked due to suspicious activity",
      },
      {
        type: "device_flagged",
        threatType: "Device Spoofing",
        riskScore: 75,
        location: "China",
        deviceId: "dev_" + Math.random().toString(36).substr(2, 9),
        description: "Suspicious device fingerprint detected",
      },
      {
        type: "user_suspended",
        threatType: "Account Takeover",
        riskScore: 95,
        location: "Nigeria",
        userId: "user_" + Math.random().toString(36).substr(2, 9),
        description: "User account suspended due to suspicious login patterns",
      },
    ]

    const threat = threats[Math.floor(Math.random() * threats.length)]
    const severities = ["low", "medium", "high", "critical"]

    const event: ThreatEvent = {
      id: "evt_" + Math.random().toString(36).substr(2, 9),
      type: threat.type as any,
      severity: severities[Math.floor(Math.random() * severities.length)] as any,
      timestamp: new Date().toISOString(),
      data: {
        ...threat,
        metadata: {
          source: "ai_detection",
          confidence: 0.8 + Math.random() * 0.2,
          processed_at: new Date().toISOString(),
        },
      },
    }

    // In a real implementation, this would broadcast to actual WebSocket clients
    console.log("Broadcasting threat event:", event)
  }
}
