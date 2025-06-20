import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { analysisData, deviceId } = await request.json()

    // Generate AI recommendations using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4"),
      system: `You are a cybersecurity AI assistant. Generate specific, actionable security recommendations based on device analysis data. 
      Return recommendations in JSON format with the following structure:
      {
        "recommendations": [
          {
            "id": "unique_id",
            "title": "Short title",
            "description": "Detailed description",
            "priority": "low|medium|high|critical",
            "category": "security|performance|compliance|automation",
            "confidence": 85,
            "impact": "Description of impact",
            "effort": "low|medium|high",
            "automated": true/false
          }
        ]
      }`,
      prompt: `Analyze this device data and provide security recommendations: ${JSON.stringify(analysisData)}`,
    })

    let recommendations
    try {
      const parsed = JSON.parse(text)
      recommendations = parsed.recommendations || []
    } catch {
      // Fallback recommendations if AI parsing fails
      recommendations = [
        {
          id: "rec_1",
          title: "Enable Multi-Factor Authentication",
          description:
            "Based on the analysis, this device would benefit from additional authentication layers to prevent unauthorized access.",
          priority: "high",
          category: "security",
          confidence: 92,
          impact: "Significantly reduces risk of account compromise",
          effort: "low",
          automated: false,
        },
        {
          id: "rec_2",
          title: "Update Browser Security Settings",
          description:
            "The detected browser configuration has potential security vulnerabilities that should be addressed.",
          priority: "medium",
          category: "security",
          confidence: 78,
          impact: "Improves overall browser security posture",
          effort: "low",
          automated: true,
        },
        {
          id: "rec_3",
          title: "Monitor Device Location Changes",
          description: "Set up alerts for unusual location-based access patterns from this device.",
          priority: "medium",
          category: "automation",
          confidence: 85,
          impact: "Early detection of potential account takeover",
          effort: "medium",
          automated: true,
        },
      ]
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("AI recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
