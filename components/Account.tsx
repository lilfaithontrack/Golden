"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import {
  User,
  Package,
  LogOut,
  Store,
  Wallet,
  Building,
  Edit,
  RefreshCw,
  ChevronDown,
  Copy,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface UserDetails {
  id: number
  name: string
  email: string
  wallet_balance: number
  bank_name?: string
  account_number?: string
  agent?: boolean
  referral_code?: string
}

interface Order {
  id: number
  payment_status: string
  createdAt: string
}

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [hasSellerAccount, setHasSellerAccount] = useState(false)
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  const [showBankUpdateForm, setShowBankUpdateForm] = useState(false)
  const [bankName, setBankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [updatingBank, setUpdatingBank] = useState(false)

  const [isFetchingDetails, setIsFetchingDetails] = useState(false)

  const [referredOrders, setReferredOrders] = useState<Order[]>([])
  const [loadingReferredOrders, setLoadingReferredOrders] = useState(false)
  const [showReferredOrdersSection, setShowReferredOrdersSection] = useState(false)

  const router = useRouter()

  const fetchUserDetails = useCallback(
    async (isInitialLoad = false) => {
      if (isFetchingDetails) return
      setIsFetchingDetails(true)
      if (isInitialLoad) {
        setLoading(true)
      }

      const token = localStorage.getItem("token")
      const storedSellerId = localStorage.getItem("sellerId")

      if (!token) {
        console.log("No token found, redirecting to login.")
        toast.error("No token found. Redirecting to login.")
        router.push("/login")
        if (isInitialLoad) setLoading(false)
        setIsFetchingDetails(false)
        return
      }

      try {
        console.log("Attempting to fetch user details...")
        const userResponse = await fetch("https://backend.yeniesuq.com/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details.")
        }

        const userData = await userResponse.json()

        if (userData && userData.success) {
          const user = userData.data
          const previousWalletBalance = userDetails?.wallet_balance
          setUserDetails(user)

          if (user.bank_name) setBankName(user.bank_name)
          if (user.account_number) setAccountNumber(user.account_number)

          if (user.agent) {
            setRole("agent")
            if (user.referral_code) {
              setReferralCode(user.referral_code)
            }
          } else {
            setRole("user")
          }

          if (!isInitialLoad) {
            if (previousWalletBalance !== undefined && previousWalletBalance !== user.wallet_balance) {
              toast.success("Wallet balance updated!")
            } else {
              toast.success("Account details refreshed!")
            }
          }
        } else {
          throw new Error("Failed to fetch user details.")
        }

        if (storedSellerId) {
          setHasSellerAccount(true)
          setSellerId(storedSellerId)
        }
      } catch (err) {
        console.error("Error fetching user details:", err)
        if (isInitialLoad) setError(err instanceof Error ? err.message : "Unknown error")
        toast.error("Failed to fetch user details. Please try logging in again.")

        // Fallback to mock data for demo
        const mockUser: UserDetails = {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          wallet_balance: 1250.75,
          bank_name: "Commercial Bank of Ethiopia",
          account_number: "1234567890",
          agent: true,
          referral_code: "REF123456",
        }

        setUserDetails(mockUser)
        if (mockUser.bank_name) setBankName(mockUser.bank_name)
        if (mockUser.account_number) setAccountNumber(mockUser.account_number)
        setRole(mockUser.agent ? "agent" : "user")
        if (mockUser.referral_code) setReferralCode(mockUser.referral_code)
      } finally {
        if (isInitialLoad) setLoading(false)
        setIsFetchingDetails(false)
      }
    },
    [isFetchingDetails, userDetails, router],
  )

  const fetchReferredOrders = useCallback(async () => {
    if (!referralCode) {
      toast.warning("No referral code found for your account.")
      return
    }
    setLoadingReferredOrders(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://backend.yeniesuq.com/api/payments/orders/by-referral/${referralCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch referred orders.")
      }

      const data = await response.json()

      if (data && data.success) {
        setReferredOrders(data.orders)
        if (data.orders.length > 0) {
          toast.success("Referred orders loaded successfully!")
        } else {
          toast.info("No orders found for your referral code yet.")
        }
      } else {
        throw new Error(data?.message || "Failed to fetch referred orders.")
      }
    } catch (err) {
      console.error("Error fetching referred orders:", err)
      toast.error(err instanceof Error ? err.message : "Could not load referred orders.")
      setReferredOrders([])
    } finally {
      setLoadingReferredOrders(false)
    }
  }, [referralCode])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to access your account")
      router.push("/login")
      return
    }
    fetchUserDetails(true)
  }, [])

  const handleCopyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      toast.success("Referral code copied!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("sellerId")
    setUserDetails(null)
    setRole(null)
    setReferralCode(null)
    toast.success("Logged out successfully.")
    router.push("/login")
  }

  const handleMyOrdersClick = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to view your orders")
      router.push("/login")
      return
    }
    router.push("/orders")
  }

  const handleManualRefreshUserDetails = () => {
    toast.info("Refreshing your account details...")
    fetchUserDetails(false)
  }

  const handleUpdateBankDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdatingBank(true)
    try {
      const token = localStorage.getItem("token")
      if (!token || !userDetails?.id) {
        toast.error("Authentication required. Please log in again.")
        router.push("/login")
        return
      }

      const response = await fetch(`https://backend.yeniesuq.com/api/user/user/${userDetails.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bank_name: bankName, account_number: accountNumber }),
      })

      if (!response.ok) {
        throw new Error("Failed to update bank details.")
      }

      const data = await response.json()

      if (data && data.success) {
        setUserDetails((prevDetails) =>
          prevDetails ? { ...prevDetails, bank_name: bankName, account_number: accountNumber } : null,
        )
        toast.success("Bank details updated successfully!")
        setShowBankUpdateForm(false)
      } else {
        throw new Error(data?.message || "Failed to update bank details.")
      }
    } catch (err) {
      console.error("Error updating bank details:", err)
      toast.error(err instanceof Error ? err.message : "Failed to update bank details. Please try again.")
    } finally {
      setUpdatingBank(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-600 font-medium">Loading account details...</p>
        </div>
      </div>
    )
  }

  if (error && !userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-4">Error: {error}</p>
          <Button onClick={() => fetchUserDetails(true)} className="bg-amber-500 hover:bg-amber-600">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center">
        <p className="text-amber-600 text-lg">No user details available. Please log in.</p>
      </div>
    )
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
            <h1 className="text-xl font-bold">My Account</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Card */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  <User className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{userDetails.name}</h2>
                  <p className="text-gray-500">{userDetails.email}</p>
                  <p className="text-xs text-amber-600 font-medium mt-1">
                    {role === "seller" ? "Seller Account" : role === "agent" ? "Agent Account" : "User Account"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Wallet Balance</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleManualRefreshUserDetails}
                  disabled={isFetchingDetails}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetchingDetails ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <div className="mt-3">
                <p className="text-3xl font-bold">
                  ETB {Number.parseFloat(userDetails.wallet_balance.toString()).toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Building className="w-5 h-5 text-amber-500" />
                  <span>Bank Details</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBankUpdateForm(!showBankUpdateForm)}
                  className="text-amber-500 hover:bg-amber-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showBankUpdateForm ? (
                <div className="space-y-2">
                  {userDetails.bank_name && userDetails.account_number ? (
                    <>
                      <p className="text-gray-700">
                        <span className="font-medium">Bank:</span> {userDetails.bank_name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Account:</span> {userDetails.account_number}
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">No bank details provided</p>
                      <Button
                        onClick={() => setShowBankUpdateForm(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Add Bank Details
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleUpdateBankDetails}>
                  <div>
                    <Label htmlFor="bankName" className="text-gray-700">
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter bank name"
                      className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber" className="text-gray-700">
                      Account Number
                    </Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                      className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBankUpdateForm(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updatingBank}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      {updatingBank ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Referral Code (for agents) */}
          {role === "agent" && referralCode && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90">Your Referral Code</p>
                    <p className="text-2xl font-bold font-mono tracking-wider">{referralCode}</p>
                  </div>
                  <Button onClick={handleCopyReferralCode} variant="ghost" className="text-white hover:bg-white/20">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Options */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="space-y-0">
                <MenuOption
                  icon={<Package className="w-5 h-5" />}
                  title="My Orders"
                  description="View order history"
                  onClick={handleMyOrdersClick}
                />
                {hasSellerAccount && role !== "seller" && (
                  <MenuOption
                    icon={<Store className="w-5 h-5" />}
                    title="Switch to Seller Account"
                    description="Access your seller dashboard"
                    onClick={() => {}}
                  />
                )}
                {role === "seller" && (
                  <MenuOption
                    icon={<Store className="w-5 h-5" />}
                    title="My Products"
                    description="Manage your products"
                    onClick={() => router.push("/seller/products")}
                  />
                )}
                <MenuOption
                  icon={<LogOut className="w-5 h-5" />}
                  title="Logout"
                  description="Sign out from your account"
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface MenuOptionProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  className?: string
}

function MenuOption({ icon, title, description, onClick, className = "" }: MenuOptionProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-amber-500 p-2 bg-amber-50 rounded-xl">{icon}</div>
        <div className="text-left">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
    </button>
  )
}
