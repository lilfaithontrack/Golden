"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
}

export default function Checkout() {
  const [customerName, setCustomerName] = useState("")
  const [referralCode, setReferralCode] = useState("c04aba83")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [shippingAddress, setShippingAddress] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [servicePayment, setServicePayment] = useState(75)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [guestId, setGuestId] = useState("")

  const router = useRouter()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(storedCart)

    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      let storedGuestId = localStorage.getItem("guestId")
      if (!storedGuestId) {
        storedGuestId = `guest-${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("guestId", storedGuestId)
      }
      setGuestId(storedGuestId)
    }
  }, [])

  useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0)

    const calculatedDeliveryFee = subtotal < 10000 ? subtotal * 0.1 : subtotal * 0.06
    setDeliveryFee(calculatedDeliveryFee)
    setTotalPrice(subtotal + servicePayment + calculatedDeliveryFee)
  }, [cartItems, servicePayment])

  const handleCheckout = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      cartItems.length === 0 ||
      totalPrice <= 0
    ) {
      setErrorMessage("All fields are required, and the cart must not be empty.")
      return
    }

    // ---------- Build payload in the exact format the API expects ----------
    const checkoutData = {
      referral_code: referralCode || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: shippingAddress,
      guest_id: guestId,
      user_id: userId,
      delivery_fee: deliveryFee,
      service_fee: servicePayment,
      total_price: totalPrice,
      // API expects "items", not "cartItems"
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }

    try {
      setIsLoading(true)

      const response = await fetch("https://backend.yeniesuq.com/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      })

      // Even some successful APIs return 200 instead of 201
      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        // ✅ Success — use whatever the backend sends
        const { checkout_id = data.checkout_id || "", guest_id = data.guest_id || guestId } = data

        // Persist values we’ll need on /payment
        localStorage.setItem("checkout_id", checkout_id)
        localStorage.setItem("guest_id", guest_id)
        localStorage.setItem("referral_code", referralCode)
        localStorage.setItem("customer_name", customerName)
        localStorage.setItem("customer_email", customerEmail)
        localStorage.setItem("customer_phone", customerPhone)
        localStorage.setItem("shipping_address", shippingAddress)
        localStorage.setItem("total_price", totalPrice.toString())
        localStorage.setItem("cart_items", JSON.stringify(cartItems))
        localStorage.setItem("user_id", userId || "null")
        localStorage.setItem("service_fee", servicePayment.toString())
        localStorage.setItem("delivery_fee", deliveryFee.toString())

        localStorage.removeItem("cart")
        setSuccessMessage("Checkout successful! Redirecting…")
        setTimeout(() => router.push("/payment"), 1500)
      } else {
        // ❌ Backend rejected – show its message if available
        throw new Error(data?.message || "Checkout failed. Please try again.")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setErrorMessage(error instanceof Error ? error.message : "Checkout failed. Please try again.")
    } finally {
      setIsLoading(false)
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
            <h1 className="text-xl font-bold">Checkout</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Cart Summary */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-amber-600">
                        {(Number(item.price) * item.quantity).toFixed(2)} birr
                      </p>
                    </div>
                  ))}

                  <Separator className="my-3" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{(totalPrice - servicePayment - deliveryFee).toFixed(2)} birr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">{servicePayment.toFixed(2)} birr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">{deliveryFee.toFixed(2)} birr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-amber-600">
                      <span>Total:</span>
                      <span>{totalPrice.toFixed(2)} birr</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-4">No items in cart</p>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <User className="w-5 h-5 text-amber-500" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div>
                <Label htmlFor="customerEmail" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div>
                <Label htmlFor="customerPhone" className="text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-gray-800">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="shippingAddress" className="text-gray-700">
                  Delivery Address
                </Label>
                <Input
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Referral Code */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800">Referral Code (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="referralCode" className="text-gray-700">
                  Referral Code
                </Label>
                <Input
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="mt-1 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error/Success Messages */}
          {errorMessage && (
            <Card className="border-0 shadow-lg bg-red-50 border-red-200 rounded-2xl">
              <CardContent className="p-4">
                <p className="text-red-600 text-center font-medium">{errorMessage}</p>
              </CardContent>
            </Card>
          )}

          {successMessage && (
            <Card className="border-0 shadow-lg bg-green-50 border-green-200 rounded-2xl">
              <CardContent className="p-4">
                <p className="text-green-600 text-center font-medium">{successMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isLoading || cartItems.length === 0}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Complete Checkout - ${totalPrice.toFixed(2)} birr`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
