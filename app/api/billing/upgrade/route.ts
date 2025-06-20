import { type NextRequest, NextResponse } from "next/server"

interface UpgradeRequest {
  planId: string
  billingCycle: "monthly" | "yearly"
  paymentData: {
    cardNumber: string
    expiryDate: string
    cvv: string
    name: string
    email: string
    company?: string
  }
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

// Mock payment processing function
async function processPayment(paymentData: UpgradeRequest["paymentData"], amount: number): Promise<PaymentResult> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock validation
  if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
    return { success: false, error: "Invalid payment information" }
  }

  if (paymentData.cardNumber === "4000000000000002") {
    return { success: false, error: "Card declined" }
  }

  // Simulate successful payment
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  }
}

// Mock user upgrade function
async function upgradeUserPlan(email: string, planId: string, billingCycle: string, transactionId: string) {
  // In a real app, this would update the database
  console.log(`Upgrading user ${email} to ${planId} plan (${billingCycle}) - Transaction: ${transactionId}`)

  // Mock database update
  const userData = {
    email,
    plan: planId,
    billingCycle,
    transactionId,
    upgradedAt: new Date().toISOString(),
    features: getPlanFeatures(planId),
  }

  return userData
}

function getPlanFeatures(planId: string) {
  const features = {
    starter: {
      apiCalls: 1000,
      realTimeFeeds: false,
      teamCollaboration: false,
      customModels: false,
      support: "email",
    },
    professional: {
      apiCalls: 10000,
      realTimeFeeds: true,
      teamCollaboration: true,
      customModels: false,
      support: "priority",
    },
    enterprise: {
      apiCalls: -1, // unlimited
      realTimeFeeds: true,
      teamCollaboration: true,
      customModels: true,
      support: "24/7",
    },
  }

  return features[planId as keyof typeof features] || features.starter
}

function getPlanPrice(planId: string, billingCycle: string) {
  const prices = {
    starter: { monthly: 29, yearly: 23 },
    professional: { monthly: 99, yearly: 79 },
    enterprise: { monthly: 299, yearly: 239 },
  }

  const plan = prices[planId as keyof typeof prices]
  return plan ? plan[billingCycle as keyof typeof plan] : 0
}

export async function POST(request: NextRequest) {
  try {
    const body: UpgradeRequest = await request.json()

    // Validate request
    if (!body.planId || !body.billingCycle || !body.paymentData) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Calculate amount
    const amount = getPlanPrice(body.planId, body.billingCycle)
    if (amount === 0) {
      return NextResponse.json({ success: false, error: "Invalid plan selected" }, { status: 400 })
    }

    // Process payment
    const paymentResult = await processPayment(body.paymentData, amount)

    if (!paymentResult.success) {
      return NextResponse.json({
        success: false,
        error: paymentResult.error,
      })
    }

    // Upgrade user plan
    const userData = await upgradeUserPlan(
      body.paymentData.email,
      body.planId,
      body.billingCycle,
      paymentResult.transactionId!,
    )

    // Send confirmation email (mock)
    console.log(`Sending confirmation email to ${body.paymentData.email}`)

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      userData,
      message: "Upgrade successful! Welcome to your new plan.",
    })
  } catch (error) {
    console.error("Upgrade error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
