"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Copy, ArrowLeft, Upload, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer")
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [successModalVisible, setSuccessModalVisible] = useState(false)

  const router = useRouter()

  const bankAccounts = [
    { name: "Zemen Bank", account: "1294111208405016" },
    { name: "Dashen Bank", account: "013200107145100" },
    { name: "BOA", account: "39587254" },
    { name: "CBE", account: "1000642508141" },
    { name: "TeleBirr", account: "0919465620" },
  ]

  useEffect(() => {
    try {
      const storedTotalPrice = Number(localStorage.getItem("total_price") || 0)
      setTotalPrice(storedTotalPrice)
    } catch (error) {
      setError("Error loading payment data.")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.")
      return
    }
    if (file && !file.type.startsWith("image")) {
      setError("Please upload a valid image file.")
      return
    }
    setPaymentScreenshot(file)
    setError("")
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Account number copied to clipboard!")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentScreenshot) {
      setError("Please upload the payment screenshot.")
      return
    }

    // Get all required data from localStorage
    const guestId = localStorage.getItem("guest_id") || ""
    const cartItems = JSON.parse(localStorage.getItem("cart_items") || "[]")
    const totalPrice = Number(localStorage.getItem("total_price") || 0)
    const shippingAddress = localStorage.getItem("shipping_address") || ""
    const customerName = localStorage.getItem("customer_name") || ""
    const customerEmail = localStorage.getItem("customer_email") || ""
    const customerPhone = localStorage.getItem("customer_phone") || ""
    const deliveryFee = localStorage.getItem("delivery_fee") || 0
    const serviceFee = localStorage.getItem("service_fee") || 0
    const referralCode = localStorage.getItem("referral_code") || ""

    if (
      !guestId ||
      !cartItems.length ||
      !totalPrice ||
      !shippingAddress ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      setError("All fields are required. Please ensure all data is filled.")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    const formData = new FormData()
    formData.append("guest_id", guestId)
    formData.append("payment_method", paymentMethod)
    formData.append("payment_screenshot", paymentScreenshot)
    formData.append("cart_items", JSON.stringify(cartItems))
    formData.append("total_price", totalPrice.toString())
    formData.append("shipping_address", shippingAddress)
    formData.append("customer_name", customerName)
    formData.append("customer_email", customerEmail)
    formData.append("customer_phone", customerPhone)
    formData.append("service_fee", serviceFee.toString())
    formData.append("delivery_fee", deliveryFee.toString())
    formData.append("referral_code", referralCode)

    try {
      const response = await fetch("https://backend.yeniesuq.com/api/payments/create", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessModalVisible(true)
        setPaymentScreenshot(null)
      } else {
        setError(data.message || "Error submitting payment.")
      }
    } catch (err) {
      console.error("Payment submission error:", err)
      setError("Failed to submit payment. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const closeSuccessModal = () => {
    setSuccessModalVisible(false)
    router.push("/orders")
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
            <h1 className="text-xl font-bold">Payment</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Total Amount */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Total Amount</h3>
              <p className="text-3xl font-bold">{totalPrice.toFixed(2)} ብር</p>
            </CardContent>
          </Card>

          {/* Bank Account Details */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800 text-center">Bank Account Details</CardTitle>
              <p className="text-center text-gray-600 text-sm">Belay Morde Tadesse</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {bankAccounts.map((bank, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-100"
                >
                  <div>
                    <p className="font-medium text-gray-800">{bank.name}</p>
                    <p className="text-sm text-gray-600 font-mono">{bank.account}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(bank.account)}
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-800">Submit Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Payment Method */}
                <div>
                  <Label htmlFor="payment_method" className="text-gray-700">
                    Payment Method
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-1 border-gray-200 focus:border-amber-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Chapa" disabled>
                        Chapa (coming soon)
                      </SelectItem>
                      <SelectItem value="TeleBirr" disabled>
                        TeleBirr (coming soon)
                      </SelectItem>
                      <SelectItem value="PayPal" disabled>
                        PayPal (coming soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="payment_screenshot" className="text-gray-700">
                    Upload Payment Screenshot
                  </Label>
                  <div className="mt-1">
                    <div className="flex items-center justify-center border-2 border-dashed border-amber-300 rounded-xl h-32 bg-gradient-to-br from-amber-50 to-white hover:border-amber-400 transition-colors">
                      <input
                        type="file"
                        id="payment_screenshot"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpeg, image/jpg, image/png"
                      />
                      <label
                        htmlFor="payment_screenshot"
                        className="flex flex-col items-center justify-center cursor-pointer text-center p-4"
                      >
                        <Upload className="w-8 h-8 text-amber-500 mb-2" />
                        <span className="text-amber-600 font-medium">
                          {paymentScreenshot ? paymentScreenshot.name : "Click to upload screenshot"}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !paymentScreenshot}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Payment"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Success Modal */}
        <Dialog open={successModalVisible} onOpenChange={setSuccessModalVisible}>
          <DialogContent className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border-0">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold text-gray-800">Payment Successful!</DialogTitle>
            </DialogHeader>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Your payment has been successfully submitted. You will be redirected to your orders page.
              </p>
              <Button
                onClick={closeSuccessModal}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold"
              >
                Go to Orders
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
