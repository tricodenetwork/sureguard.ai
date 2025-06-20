"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Users, TrendingUp, Globe, Zap, Star, ArrowRight, Play, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        className={`border-b sticky top-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/80 backdrop-blur-sm"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">SureGuard</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Pricing
            </button>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="hidden md:inline-flex hover:bg-gray-100 transition-colors duration-200"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
                  Get Started
                </Button>
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t bg-white"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="block w-full text-left text-gray-600 hover:text-gray-900 py-2"
                >
                  Pricing
                </button>
                <Link href="/about" className="block text-gray-600 hover:text-gray-900 py-2">
                  About
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-gray-900 py-2">
                  Contact
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-white/20 text-white border-white/30">Trusted by 500+ companies</Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AI-powered real-time fraud
            <br />
            detection and prevention tool
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Protect your business with advanced machine learning algorithms that detect and prevent fraud in real-time.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="flex justify-center mt-10 px-4">
                  <div className="flex w-full max-w-xl bg-white rounded-full shadow-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="Enter IP address to start tracking"
                      className="flex-grow px-4 py-3 text-sm sm:text-base text-gray-800 focus:outline-none"
                    />
                    <Link href="/freemium">
                    <button
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold text-sm sm:text-base rounded-full m-1 whitespace-nowrap"
                    >
                      Start Free Trial
                    </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-5xl mx-auto">
              <motion.div
                className="bg-white rounded-xl shadow-2xl overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">SureGuard Dashboard</span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                      {
                        title: "AI-Powered Detection",
                        value: "99.7%",
                        subtitle: "Accuracy Rate",
                        color: "text-orange-600",
                      },
                      { title: "Threats Blocked", value: "2,847", subtitle: "This month", color: "text-pink-600" },
                      { title: "Response Time", value: "<50ms", subtitle: "Average", color: "text-purple-600" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow duration-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                            <p className="text-xs text-gray-500">{stat.subtitle}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Real-time Analytics</span>
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="h-20 bg-gradient-to-r from-orange-200 to-pink-200 rounded opacity-60"></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trusted by logos */}
        <motion.div
          className="relative bg-white/10 backdrop-blur-sm border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-white/80 mb-6">Trusted by industry leaders</p>
            <div className="flex justify-center items-center space-x-12 opacity-60">
              {["BOOO", "Shopware", "Microsoft", "Salesforce", "IBM", "Oracle"].map((company, index) => (
                <motion.div
                  key={company}
                  className="text-white font-bold text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Safeguard your digital world with
              <br />
              AI-powered fraud detection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced machine learning algorithms analyze patterns, detect anomalies, and prevent fraud before it
              impacts your business.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="space-y-20">
            {/* Feature 1 */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Ensuring your data
                  <br />
                  remains secure.
                </h3>
                <p className="text-gray-600 mb-8">
                  Advanced encryption and security protocols ensure your sensitive data is protected at all times. Our
                  platform meets the highest industry standards for data security and compliance.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="text-4xl font-bold text-orange-600 mb-2">10X</div>
                    <p className="text-gray-600">Faster detection than traditional methods</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="text-4xl font-bold text-pink-600 mb-2">100%</div>
                    <p className="text-gray-600">Data encryption and security compliance</p>
                  </motion.div>
                </div>
              </div>
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="space-y-4">
                  {[
                    { label: "Security Score", value: "98%", color: "bg-green-500", width: "w-4/5" },
                    { label: "Threat Detection", value: "100%", color: "bg-orange-500", width: "w-full" },
                    { label: "Response Time", value: "<50ms", color: "bg-pink-500", width: "w-4/5" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-gray-700">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <motion.div
                            className={`h-2 ${item.color} rounded-full ${item.width}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: item.width }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        <span className="text-gray-600 font-semibold">{item.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Feature 2 - Team Collaboration */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white order-2 md:order-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="mb-6">
                  <Users className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Team Collaboration</h3>
                  <p className="text-blue-100">
                    Work together seamlessly with your security team to respond to threats in real-time.
                  </p>
                </div>
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Sarah Johnson</div>
                      <div className="text-xs text-blue-200">Security Analyst</div>
                    </div>
                  </div>
                  <div className="text-sm text-blue-100">
                    "Detected suspicious activity on user account #4521. Initiating security protocol."
                  </div>
                </motion.div>
              </motion.div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Empower your team with
                  <br />
                  actionable AI insights.
                </h3>
                <p className="text-gray-600 mb-8">
                  Our AI doesn't just detect threats - it provides actionable insights and recommendations to help your
                  team make informed decisions quickly.
                </p>
                <div className="space-y-4">
                  {["Real-time threat intelligence", "Automated response workflows", "Detailed forensic analysis"].map(
                    (feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>

            {/* Feature 3 - Automation */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  No more manual tracking
                  <br />
                  let SureGuard do the work.
                </h3>
                <p className="text-gray-600 mb-8">
                  Eliminate time-consuming manual processes with our automated fraud detection system. Focus on what
                  matters most while we handle the security.
                </p>
                <Link href="/features">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-200">
                      Explore automation features
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-8"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Automated Detection</h4>
                  <p className="text-gray-600 text-sm">Real-time monitoring and response</p>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      text: "✓ Transaction verified",
                      time: "2 sec ago",
                      bg: "bg-green-50",
                      border: "border-green-200",
                      color: "text-green-800",
                    },
                    {
                      text: "⚠ Suspicious activity blocked",
                      time: "5 sec ago",
                      bg: "bg-red-50",
                      border: "border-red-200",
                      color: "text-red-800",
                    },
                    {
                      text: "ℹ Pattern analysis complete",
                      time: "12 sec ago",
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                      color: "text-blue-800",
                    },
                  ].map((alert, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center justify-between p-3 ${alert.bg} rounded-lg border ${alert.border}`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className={`${alert.color} text-sm`}>{alert.text}</span>
                      <span className="text-gray-600 text-xs">{alert.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Feature 4 - Global Collaboration */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white order-2 md:order-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="mb-6">
                  <Globe className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Global Collaboration</h3>
                  <p className="text-purple-100">
                    Connect with security teams worldwide to share threat intelligence and best practices.
                  </p>
                </div>
                <motion.div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { value: "24/7", label: "Monitoring" },
                      { value: "150+", label: "Countries" },
                      { value: "99.9%", label: "Uptime" },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs text-purple-200">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
              <div className="order-1 md:order-2">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Collaborate seamlessly and
                  <br />
                  respond in real-time.
                </h3>
                <p className="text-gray-600 mb-8">
                  Enable your team to work together efficiently with real-time collaboration tools, instant
                  notifications, and shared threat intelligence.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Zap, text: "Instant threat alerts", color: "text-yellow-500" },
                    { icon: Users, text: "Team coordination tools", color: "text-blue-500" },
                    { icon: Globe, text: "Global threat intelligence", color: "text-green-500" },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 5 }}
                    >
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-gray-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, scalable pricing</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core fraud detection features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                description: "Perfect for small businesses",
                features: [
                  "Up to 1,000 transactions/month",
                  "Basic fraud detection",
                  "Email support",
                  "Dashboard analytics",
                ],
                popular: false,
                href: "/dashboard",
              },
              {
                name: "Professional",
                price: "$79",
                description: "Ideal for growing companies",
                features: [
                  "Up to 10,000 transactions/month",
                  "Advanced AI detection",
                  "Priority support",
                  "Real-time alerts",
                  "API access",
                ],
                popular: true,
                href: "/dashboard",
              },
              {
                name: "Enterprise",
                price: "$199",
                description: "For large organizations",
                features: [
                  "Unlimited transactions",
                  "Custom AI models",
                  "24/7 dedicated support",
                  "White-label solution",
                  "On-premise deployment",
                ],
                popular: false,
                href: "/contact",
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className={`relative ${plan.popular ? "border-2 border-orange-500 shadow-xl" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      <span className="text-lg font-normal text-gray-600">/mo</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 + featureIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                    <Link href={plan.href}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          className={`w-full ${plan.popular ? "bg-orange-500 hover:bg-orange-600" : ""} transition-all duration-200`}
                        >
                          {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Discover the reviews from
              <br />
              our valued customers!
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote:
                  "SureGuard's fraud detection system has been a game-changer for our business. We've seen a 95% reduction in fraudulent transactions.",
                name: "Sarah Chen",
                title: "CTO, TechCorp",
              },
              {
                quote:
                  "The real-time alerts and AI insights have helped us prevent millions in potential losses. Highly recommended!",
                name: "Michael Rodriguez",
                title: "Security Director, FinanceFirst",
              },
              {
                quote:
                  "Implementation was seamless and the support team is exceptional. Our fraud detection accuracy improved dramatically.",
                name: "Emily Watson",
                title: "Risk Manager, GlobalPay",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.title}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Jump into action with
              <br />
              our platform today!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that trust SureGuard to protect their operations from fraud. Start your free
              trial today.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg transition-all duration-200"
                >
                  Start Free Trial
                </Button>
              </motion.div>
            </Link>
            <Link href="/demo">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg transition-all duration-200"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Platform preview */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <motion.div
                className="bg-white rounded-xl shadow-2xl overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-gray-900 px-6 py-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-20 bg-gradient-to-r from-orange-200 to-pink-200 rounded"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-20 bg-gradient-to-r from-purple-200 to-blue-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <motion.div
                className="flex items-center space-x-2 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Shield className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold">SureGuard</span>
              </motion.div>
              <p className="text-gray-400 mb-4">
                Protecting businesses worldwide with AI-powered fraud detection and prevention.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: [
                  { name: "Features", href: "#features" },
                  { name: "Pricing", href: "#pricing" },
                  { name: "API Docs", href: "/api-docs" },
                  { name: "Integrations", href: "/integrations" },
                ],
              },
              {
                title: "Company",
                links: [
                  { name: "About", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { name: "Documentation", href: "/docs" },
                  { name: "Help Center", href: "/help" },
                  { name: "Security", href: "/security" },
                  { name: "Privacy Policy", href: "/privacy" },
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.href.startsWith("#") ? (
                        <button
                          onClick={() => scrollToSection(link.href.slice(1))}
                          className="hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </button>
                      ) : (
                        <Link href={link.href} className="hover:text-white transition-colors duration-200">
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="border-t border-gray-800 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 SureGuard AI. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
