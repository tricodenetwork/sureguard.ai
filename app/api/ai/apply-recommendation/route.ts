import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { recommendationId, deviceId } = await request.json()

    // Simulate applying the recommendation
    // In a real app, this would trigger actual security actions
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Log the action
    console.log(`Applied recommendation ${recommendationId} for device ${deviceId}`)

    return NextResponse.json({
      success: true,
      message: "Recommendation applied successfully",
      appliedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Apply recommendation error:", error)
    return NextResponse.json({ error: "Failed to apply recommendation" }, { status: 500 })
  }
}
