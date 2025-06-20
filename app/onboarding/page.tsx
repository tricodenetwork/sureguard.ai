"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, Users, Target, Settings, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Welcome to SureGuard AI",
    description: "Let's get you set up with the best fraud protection",
    icon: Shield,
  },
  {
    id: 2,
    title: "Tell us about your business",
    description: "Help us customize your fraud detection",
    icon: Target,
  },
  {
    id: 3,
    title: "Configure your preferences",
    description: "Set up alerts and monitoring settings",
    icon: Settings,
  },
  {
    id: 4,
    title: "You're all set!",
    description: "Your fraud protection is now active",
    icon: CheckCircle,
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [businessData, setBusinessData] = useState({
    industry: "",
    size: "",
    volume: "",
    description: "",
    riskTolerance: "medium",
    alertEmail: "",
    enableSMS: false,
    enableSlack: false,
  })
  const router = useRouter()

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to SureGuard AI</h2>
              <p className="text-gray-600">
                We'll help you set up comprehensive fraud protection in just a few steps. This should take about 3
                minutes.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium">Real-time Protection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium">AI-Powered Detection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <p className="font-medium">24/7 Monitoring</p>
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
              <p className="text-gray-600">This helps us customize your fraud detection settings</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setBusinessData({ ...businessData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="fintech">Fintech</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="travel">Travel & Hospitality</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">Company Size</Label>
                <Select onValueChange={(value) => setBusinessData({ ...businessData, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (200+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="volume">Monthly Transaction Volume</Label>
                <Select onValueChange={(value) => setBusinessData({ ...businessData, volume: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transaction volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Under $10K</SelectItem>
                    <SelectItem value="medium">$10K - $100K</SelectItem>
                    <SelectItem value="high">$100K - $1M</SelectItem>
                    <SelectItem value="enterprise">$1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Brief Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about your business and fraud concerns..."
                  value={businessData.description}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Configure your preferences</h2>
              <p className="text-gray-600">Set up how you want to receive alerts and notifications</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Risk Tolerance</Label>
                <p className="text-sm text-gray-600 mb-3">How sensitive should our fraud detection be?</p>
                <div className="grid grid-cols-3 gap-3">
                  {["low", "medium", "high"].map((level) => (
                    <div
                      key={level}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        businessData.riskTolerance === level
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBusinessData({ ...businessData, riskTolerance: level })}
                    >
                      <div className="text-center">
                        <div className="font-medium capitalize">{level}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {level === "low" && "Fewer false positives"}
                          {level === "medium" && "Balanced approach"}
                          {level === "high" && "Maximum protection"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="alertEmail">Alert Email</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  placeholder="alerts@yourcompany.com"
                  value={businessData.alertEmail}
                  onChange={(e) => setBusinessData({ ...businessData, alertEmail: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Additional Notifications</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={businessData.enableSMS}
                    onCheckedChange={(checked) => setBusinessData({ ...businessData, enableSMS: checked as boolean })}
                  />
                  <Label htmlFor="sms">Enable SMS alerts for critical threats</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="slack"
                    checked={businessData.enableSlack}
                    onCheckedChange={(checked) => setBusinessData({ ...businessData, enableSlack: checked as boolean })}
                  />
                  <Label htmlFor="slack">Send alerts to Slack channel</Label>
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
              <p className="text-gray-600">
                Your SureGuard AI fraud protection is now active and monitoring your transactions.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Industry:</span>
                <Badge variant="secondary">{businessData.industry || "Not specified"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Level:</span>
                <Badge variant="outline">{businessData.riskTolerance}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alert Email:</span>
                <span className="text-sm">{businessData.alertEmail || "Not set"}</span>
              </div>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SureGuard AI</span>
            </div>
            <Badge variant="outline">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext} className="flex items-center">
                {currentStep === steps.length ? "Go to Dashboard" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
