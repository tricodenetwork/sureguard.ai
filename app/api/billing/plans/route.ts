import { NextResponse } from "next/server"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started with threat detection",
    pricing: {
      monthly: 29,
      yearly: 23,
    },
    features: {
      apiCalls: 1000,
      realTimeFeeds: false,
      teamCollaboration: false,
      customModels: false,
      support: "email",
      deviceAnalysis: "basic",
      threatDetection: "basic",
    },
    limits: {
      users: 3,
      integrations: 2,
      dataRetention: 30, // days
    },
  },
  {
    id: "professional",
    name: "Professional",
    description: "Advanced features for growing security teams",
    pricing: {
      monthly: 99,
      yearly: 79,
    },
    features: {
      apiCalls: 10000,
      realTimeFeeds: true,
      teamCollaboration: true,
      customModels: false,
      support: "priority",
      deviceAnalysis: "advanced",
      threatDetection: "advanced",
    },
    limits: {
      users: 15,
      integrations: 10,
      dataRetention: 90, // days
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Full-scale security operations for large organizations",
    pricing: {
      monthly: 299,
      yearly: 239,
    },
    features: {
      apiCalls: -1, // unlimited
      realTimeFeeds: true,
      teamCollaboration: true,
      customModels: true,
      support: "24/7",
      deviceAnalysis: "enterprise",
      threatDetection: "enterprise",
    },
    limits: {
      users: -1, // unlimited
      integrations: -1, // unlimited
      dataRetention: 365, // days
    },
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      plans,
    })
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch plans" }, { status: 500 })
  }
}
