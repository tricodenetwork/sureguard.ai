"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Play, CheckCircle, ArrowLeft, Clock, Users, BarChart3 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">SureGuard</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30">Interactive Demo</Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">See SureGuard in action</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Experience our AI-powered fraud detection system with a live, interactive demo. See how we protect
              businesses like yours in real-time.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Start Interactive Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What you'll see in the demo</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive demo covers all the key features that make SureGuard the leading fraud detection
              platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Watch live fraud detection in action with real-time dashboards and alerts",
                duration: "5 minutes",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "See how security teams work together to investigate and respond to threats",
                duration: "3 minutes",
              },
              {
                icon: Shield,
                title: "AI Detection Engine",
                description: "Experience our machine learning algorithms identifying suspicious patterns",
                duration: "7 minutes",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="px-0 pt-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-4">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{feature.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Placeholder */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Interactive Demo Coming Soon</h3>
                <p className="text-gray-300 mb-8">
                  We're putting the finishing touches on our interactive demo experience. In the meantime, schedule a
                  personalized demo with our team.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Schedule Personal Demo
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Try Free Trial Instead
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why choose a demo?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["See real fraud patterns", "Test with your data", "Meet our team", "Custom configuration"].map(
              (benefit, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{benefit}</h3>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
