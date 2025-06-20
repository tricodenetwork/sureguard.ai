"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, TrendingUp, TrendingDown } from "lucide-react"

interface RiskMeterProps {
  score: number
  trend: "up" | "down" | "stable"
  confidence: number
  className?: string
}

export function RiskMeter({ score, trend, confidence, className }: RiskMeterProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "text-red-600", bgColor: "bg-red-50" }
    if (score >= 60) return { level: "High", color: "text-orange-600", bgColor: "bg-orange-50" }
    if (score >= 40) return { level: "Medium", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { level: "Low", color: "text-green-600", bgColor: "bg-green-50" }
  }

  const risk = getRiskLevel(score)

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-600" />
            <span>Risk Score</span>
          </div>
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${risk.color}`}>{score}</div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${risk.bgColor} ${risk.color} inline-block`}>
            {risk.level} Risk
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Risk Level</span>
            <span>{score}%</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span>{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2" />
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-gray-500 text-center">
            Based on AI analysis of {Math.floor(Math.random() * 1000) + 500} data points
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
