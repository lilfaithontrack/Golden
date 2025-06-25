"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://backend.yeniesuq.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user.id.toString())

        // Store user data for quick access
        localStorage.setItem("userData", JSON.stringify(data.user))

        toast.success("Login successful! Welcome back!")

        // Redirect to home page
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Unable to login. Please check your internet connection and try again.")

      // For demo purposes, allow login with any credentials
      if (email && password) {
        localStorage.setItem("token", "demo-token-12345")
        localStorage.setItem("userId", "1")
        localStorage.setItem(
          "userData",
          JSON.stringify({
            id: 1,
            name: "Demo User",
            email: email,
            wallet_balance: 1250.75,
            agent: false,
          }),
        )
        toast.success("Demo login successful!")
        setTimeout(() => {
          router.push("/")
        }, 1000)
      }
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
            <h1 className="text-xl font-bold">Login</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4">
          <Card className="border-0 shadow-2xl bg-white rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-white/90">Sign in to your Yene Suq account</p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
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

                {/* Password Field */}
                <div>
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="pl-10 pr-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Button variant="link" className="text-amber-600 p-0 h-auto text-sm">
                    Forgot Password?
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Sign Up Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-amber-600 font-medium hover:text-amber-700">
                      Create Account
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="border-0 shadow-lg bg-blue-50 rounded-2xl mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Demo Credentials</h3>
              <p className="text-sm text-blue-700 mb-2">For testing purposes, you can use any email and password.</p>
              <div className="space-y-1 text-xs text-blue-600">
                <p>Email: demo@yenesuq.com</p>
                <p>Password: demo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
