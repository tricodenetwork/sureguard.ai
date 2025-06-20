import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { recommendationId, isHelpful, feedback, deviceId } = await request.json()

    // Store feedback in database (simulated)
    const feedbackData = {
      id: Date.now().toString(),
      recommendationId,
      isHelpful,
      feedback,
      deviceId,
      timestamp: new Date().toISOString(),
    }

    console.log("User feedback received:", feedbackData)

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
