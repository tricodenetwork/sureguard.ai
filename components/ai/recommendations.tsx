"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Shield, Lightbulb, CheckCircle, Zap, ThumbsUp, ThumbsDown } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface AIRecommendation {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  category: "security" | "performance" | "compliance" | "automation"
  confidence: number
  impact: string
  effort: "low" | "medium" | "high"
  automated: boolean
  applied: boolean
}

interface AIRecommendationsProps {
  analysisData?: any
  deviceId?: string
  className?: string
}

export function AIRecommendations({ analysisData, deviceId, className }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ [key: string]: "helpful" | "not_helpful" | null }>({})
  const [feedbackText, setFeedbackText] = useState("")
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (analysisData || deviceId) {
      generateRecommendations()
    }
  }, [analysisData, deviceId])

  const generateRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisData, deviceId }),
      })

      if (!response.ok) throw new Error("Failed to generate recommendations")

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("Failed to generate AI recommendations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyRecommendation = async (recommendationId: string) => {
    try {
      const response = await fetch("/api/ai/apply-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, deviceId }),
      })

      if (!response.ok) throw new Error("Failed to apply recommendation")

      setRecommendations((prev) => prev.map((rec) => (rec.id === recommendationId ? { ...rec, applied: true } : rec)))
    } catch (error) {
      console.error("Failed to apply recommendation:", error)
    }
  }

  const submitFeedback = async (recommendationId: string, isHelpful: boolean) => {
    try {
      await fetch("/api/ai/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId,
          isHelpful,
          feedback: feedbackText,
          deviceId,
        }),
      })

      setFeedback((prev) => ({
        ...prev,
        [recommendationId]: isHelpful ? "helpful" : "not_helpful",
      }))
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return Shield
      case "performance":
        return Zap
      case "compliance":
        return CheckCircle
      case "automation":
        return Brain
      default:
        return Lightbulb
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <LoadingSpinner text="Generating AI recommendations..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <span>AI Security Recommendations</span>
          <Badge variant="outline" className="ml-auto">
            {recommendations.length} suggestions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Analyze a device to get AI-powered security suggestions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => {
              const CategoryIcon = getCategoryIcon(recommendation.category)
              const userFeedback = feedback[recommendation.id]

              return (
                <div
                  key={recommendation.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    recommendation.applied ? "bg-green-50 border-green-200" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <CategoryIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {recommendation.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{recommendation.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                    {recommendation.applied && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>

                  <p className="text-gray-700 mb-3">{recommendation.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-500">Impact:</span>
                      <p>{recommendation.impact}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-500">Effort:</span>
                      <p className="capitalize">{recommendation.effort}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {recommendation.automated && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-apply
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!recommendation.applied ? (
                        <Button
                          size="sm"
                          onClick={() => applyRecommendation(recommendation.id)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Apply Recommendation
                        </Button>
                      ) : (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Applied
                        </Badge>
                      )}

                      {/* Feedback buttons */}
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => submitFeedback(recommendation.id, true)}
                          className={`p-1 ${
                            userFeedback === "helpful" ? "text-green-600 bg-green-50" : "text-gray-400"
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => submitFeedback(recommendation.id, false)}
                          className={`p-1 ${
                            userFeedback === "not_helpful" ? "text-red-600 bg-red-50" : "text-gray-400"
                          }`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Feedback Section */}
        {showFeedback && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Additional Feedback</h4>
            <Textarea
              placeholder="Help us improve our AI recommendations..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => setShowFeedback(false)}>
                Submit Feedback
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowFeedback(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!showFeedback && recommendations.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setShowFeedback(true)} className="w-full">
            Provide Additional Feedback
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
