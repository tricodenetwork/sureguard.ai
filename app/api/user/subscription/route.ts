import { type NextRequest, NextResponse } from "next/server"

// Mock user subscription data
const mockSubscriptions = {
  "user@example.com": {
    id: "sub_123456789",
    userId: "user_123",
    email: "user@example.com",
    planId: "professional",
    billingCycle: "monthly",
    status: "active",
    currentPeriodStart: "2024-01-01T00:00:00Z",
    currentPeriodEnd: "2024-02-01T00:00:00Z",
    cancelAtPeriodEnd: false,
    usage: {
      apiCalls: 2450,
      apiCallsLimit: 10000,
      teamMembers: 5,
      teamMembersLimit: 15,
    },
    features: {
      realTimeFeeds: true,
      teamCollaboration: true,
      customModels: false,
      support: "priority",
    },
  },
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user from authentication
    const email = request.nextUrl.searchParams.get("email") || "user@example.com"

    const subscription = mockSubscriptions[email as keyof typeof mockSubscriptions]

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email } = body

    // Mock subscription management
    switch (action) {
      case "cancel":
        return NextResponse.json({
          success: true,
          message: "Subscription cancelled successfully",
        })

      case "reactivate":
        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully",
        })

      case "change_plan":
        return NextResponse.json({
          success: true,
          message: "Plan changed successfully",
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Error managing subscription:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
