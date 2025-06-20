"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Check, Zap, CreditCard, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    description: "Perfect for small teams getting started with threat detection",
    features: [
      "Up to 1,000 API calls/month",
      "Basic threat detection",
      "Email support",
      "Dashboard access",
      "Basic device analysis",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "Advanced features for growing security teams",
    features: [
      "Up to 10,000 API calls/month",
      "Advanced AI threat detection",
      "Real-time WebSocket feeds",
      "Team collaboration tools",
      "Priority support",
      "Advanced device fingerprinting",
      "Custom integrations",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    description: "Full-scale security operations for large organizations",
    features: [
      "Unlimited API calls",
      "Custom AI models",
      "24/7 phone support",
      "Advanced analytics",
      "White-label options",
      "Dedicated account manager",
      "Custom deployment",
      "SLA guarantees",
    ],
    popular: false,
  },
]

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    company: "",
  })

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          paymentData,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to success page or dashboard
        window.location.href = "/dashboard?upgraded=true"
      } else {
        alert("Payment failed: " + result.error)
      }
    } catch (error) {
      console.error("Upgrade failed:", error)
      alert("Upgrade failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getDiscountedPrice = (price: number) => {
    return billingCycle === "yearly" ? Math.round(price * 0.8) : price
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <Shield className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-900">Sureguard</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade Your Security</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the perfect plan for your organization's security needs</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={billingCycle === "monthly" ? "font-medium" : "text-gray-500"}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-orange-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={billingCycle === "yearly" ? "font-medium" : "text-gray-500"}>
              Yearly <Badge className="ml-1">20% off</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-orange-500 shadow-lg scale-105" : "border-gray-200"
              } ${selectedPlan === plan.id ? "ring-2 ring-orange-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-orange-600 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${getDiscountedPrice(plan.price)}</span>
                  <span className="text-gray-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  {billingCycle === "yearly" && plan.price !== getDiscountedPrice(plan.price) && (
                    <div className="text-sm text-gray-500 line-through">
                      ${plan.price}/{billingCycle === "monthly" ? "mo" : "yr"}
                    </div>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Checkout Form */}
        {selectedPlan && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6" />
                <span>Complete Your Upgrade</span>
              </CardTitle>
              <CardDescription>Upgrading to {plans.find((p) => p.id === selectedPlan)?.name} plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="flex justify-between items-center">
                  <span>
                    {plans.find((p) => p.id === selectedPlan)?.name} Plan ({billingCycle})
                  </span>
                  <span className="font-medium">
                    ${getDiscountedPrice(plans.find((p) => p.id === selectedPlan)?.price || 0)}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <div className="flex justify-between items-center text-green-600 text-sm">
                    <span>Yearly discount (20%)</span>
                    <span>-${Math.round((plans.find((p) => p.id === selectedPlan)?.price || 0) * 0.2)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span>${getDiscountedPrice(plans.find((p) => p.id === selectedPlan)?.price || 0)}</span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      placeholder="John Doe"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company (Optional)</label>
                    <Input
                      placeholder="Acme Corp"
                      value={paymentData.company}
                      onChange={(e) => setPaymentData({ ...paymentData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Input
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-50 p-3 rounded">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedPlan(null)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleUpgrade(selectedPlan)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-medium">Features</th>
                      <th className="text-center p-4 font-medium">Starter</th>
                      <th className="text-center p-4 font-medium">Professional</th>
                      <th className="text-center p-4 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-4">API Calls per month</td>
                      <td className="text-center p-4">1,000</td>
                      <td className="text-center p-4">10,000</td>
                      <td className="text-center p-4">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4">Real-time WebSocket</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">✅</td>
                      <td className="text-center p-4">✅</td>
                    </tr>
                    <tr>
                      <td className="p-4">Team Collaboration</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">✅</td>
                      <td className="text-center p-4">✅</td>
                    </tr>
                    <tr>
                      <td className="p-4">Custom AI Models</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">✅</td>
                    </tr>
                    <tr>
                      <td className="p-4">24/7 Support</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">❌</td>
                      <td className="text-center p-4">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
