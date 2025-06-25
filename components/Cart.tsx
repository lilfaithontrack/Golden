"use client"

import { useEffect, useState } from "react"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(storedCart)
  }, [])

  const totalPrice = cartItems.reduce((total, item) => {
    const itemPrice = Number.parseFloat(item.price.toString()) || 0
    return total + itemPrice * item.quantity
  }, 0)

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    toast.success("Item removed from cart")
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cart")
    toast.success("Cart cleared")
  }

  const handleQuantityChange = (id: number, change: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: Math.max(1, newQuantity) }
      }
      return item
    })
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const handleQuantityInput = (id: number, value: string) => {
    const newQuantity = Math.max(1, Number.parseInt(value) || 1)

    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/checkout")
    } else {
      toast.error("Your cart is empty. Please add items before proceeding to checkout.")
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
            <h1 className="text-xl font-bold">Shopping Cart</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to continue shopping!</p>
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-cover rounded-xl"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{item.title}</h3>
                          <p className="text-amber-600 font-bold text-sm">
                            {Number.parseFloat(item.price.toString()).toFixed(2)} birr
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, -1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>

                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                                className="w-12 text-center text-sm bg-transparent border-0 focus:outline-none"
                              />

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            Subtotal:{" "}
                            <span className="font-semibold text-amber-600">
                              {(Number.parseFloat(item.price.toString()) * item.quantity).toFixed(2)} birr
                            </span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Total and Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold">{totalPrice.toFixed(2)} birr</span>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl py-3 font-semibold"
                    >
                      Clear Cart
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-white text-amber-600 hover:bg-gray-100 rounded-xl py-3 font-semibold shadow-lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
