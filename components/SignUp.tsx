"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, Lock, UserCheck, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [agent, setAgent] = useState(false)
  const [referralCode, setReferralCode] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://backend.yeniesuq.com/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          agent,
          referred_by_code: referralCode || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Sign up successful!")
        setTimeout(() => {
          router.push("/login")
        }, 1000)
      } else {
        toast.error(data.message || "Sign up failed. Please try again.")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unable to sign up. Please try again later."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Create Account</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4">
          <Card className="border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Join Yene Suq</CardTitle>
              <p className="text-white/90">Create your account to get started</p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <Label htmlFor="phone" className="text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Enter your phone number"
                      className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Create a strong password"
                      className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                  </div>
                </div>

                {/* Agent Checkbox */}
                <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <Checkbox
                    id="agent"
                    checked={agent}
                    onCheckedChange={(checked) => setAgent(checked as boolean)}
                    className="border-amber-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <Label htmlFor="agent" className="text-gray-700 font-medium">
                    Register as an Agent
                  </Label>
                </div>

                {/* Referral Code (conditional) */}
                {agent && (
                  <div>
                    <Label htmlFor="referralCode" className="text-gray-700">
                      Referral Code (Optional)
                    </Label>
                    <Input
                      id="referralCode"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="Enter referral code"
                      className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Button variant="link" onClick={() => router.push("/login")} className="text-amber-600 p-0 h-auto">
                      Login here
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
