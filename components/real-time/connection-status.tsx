"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "@/lib/websocket"
import { Wifi, WifiOff, RefreshCw, Activity } from "lucide-react"

interface ConnectionStatusProps {
  className?: string
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const { isConnected, isConnecting, error, connectionCount, connect, disconnect } = useWebSocket()

  const getStatusColor = () => {
    if (isConnecting) return "bg-yellow-100 text-yellow-800"
    if (isConnected) return "bg-green-100 text-green-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusText = () => {
    if (isConnecting) return "Connecting..."
    if (isConnected) return "Connected"
    return "Disconnected"
  }

  const getStatusIcon = () => {
    if (isConnecting) return <RefreshCw className="h-4 w-4 animate-spin" />
    if (isConnected) return <Wifi className="h-4 w-4" />
    return <WifiOff className="h-4 w-4" />
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">WebSocket</span>
            </div>
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
            {connectionCount > 1 && <Badge variant="outline">Reconnected {connectionCount - 1}x</Badge>}
          </div>

          <div className="flex items-center space-x-2">
            {isConnected && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Activity className="h-3 w-3" />
                <span>Live</span>
              </div>
            )}

            {!isConnected && !isConnecting && (
              <Button size="sm" variant="outline" onClick={connect}>
                Reconnect
              </Button>
            )}

            {isConnected && (
              <Button size="sm" variant="outline" onClick={disconnect}>
                Disconnect
              </Button>
            )}
          </div>
        </div>

        {error && <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      </CardContent>
    </Card>
  )
}
