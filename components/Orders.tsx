"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"

interface OrderItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: number
  order_number: string
  total_amount: number
  payment_status: "pending" | "paid" | "failed" | "refunded"
  order_status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
  created_at: string
  items: OrderItem[]
  shipping_address: string
  customer_name: string
  customer_phone: string
  delivery_fee: number
  service_fee: number
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")

        if (!token) {
          toast.error("Please login to view your orders")
          router.push("/login")
          return
        }

        const response = await fetch(`https://backend.yeniesuq.com/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()

        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError(err instanceof Error ? err.message : "Failed to load orders")

        // Fallback to mock data
        const mockOrders: Order[] = [
          {
            id: 1,
            order_number: "YS-2024-001",
            total_amount: 2450.75,
            payment_status: "paid",
            order_status: "delivered",
            created_at: "2024-01-15T10:30:00Z",
            shipping_address: "Bole, Addis Ababa",
            customer_name: "John Doe",
            customer_phone: "+251911234567",
            delivery_fee: 150,
            service_fee: 75,
            items: [
              {
                id: 1,
                title: "ብሮኪሊ 20-50",
                price: 175,
                quantity: 2,
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                id: 2,
                title: "ካሮት 30-60",
                price: 120,
                quantity: 3,
                image: "/placeholder.svg?height=60&width=60",
              },
            ],
          },
          {
            id: 2,
            order_number: "YS-2024-002",
            total_amount: 1850.5,
            payment_status: "pending",
            order_status: "processing",
            created_at: "2024-01-20T14:15:00Z",
            shipping_address: "Kazanchis, Addis Ababa",
            customer_name: "Jane Smith",
            customer_phone: "+251922345678",
            delivery_fee: 100,
            service_fee: 75,
            items: [
              {
                id: 3,
                title: "ቲማቲም 25-45",
                price: 95,
                quantity: 5,
                image: "/placeholder.svg?height=60&width=60",
              },
            ],
          },
          {
            id: 3,
            order_number: "YS-2024-003",
            total_amount: 3200.25,
            payment_status: "paid",
            order_status: "shipped",
            created_at: "2024-01-22T09:45:00Z",
            shipping_address: "Piassa, Addis Ababa",
            customer_name: "Ahmed Ali",
            customer_phone: "+251933456789",
            delivery_fee: 200,
            service_fee: 75,
            items: [
              {
                id: 4,
                title: "ሽንኩርት 15-35",
                price: 85,
                quantity: 4,
                image: "/placeholder.svg?height=60&width=60",
              },
              {
                id: 5,
                title: "ድንች 40-80",
                price: 150,
                quantity: 2,
                image: "/placeholder.svg?height=60&width=60",
              },
            ],
          },
        ]
        setOrders(mockOrders)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      case "shipped":
        return <Truck className="w-4 h-4 text-purple-500" />
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
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
            <h1 className="text-xl font-bold">My Orders</h1>
            <div className="w-8" />
          </div>
        </div>

        <div className="p-4">
          {error && (
            <Card className="border-0 shadow-lg bg-red-50 border-red-200 rounded-2xl mb-4">
              <CardContent className="p-4">
                <p className="text-red-600 text-center font-medium">{error}</p>
              </CardContent>
            </Card>
          )}

          {orders.length === 0 ? (
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="text-center py-12">
                <Package className="w-16 h-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping!</p>
                <Button
                  onClick={() => router.push("/shop")}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">#{order.order_number}</CardTitle>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-600">{order.total_amount.toFixed(2)} birr</p>
                        <div className="flex space-x-2 mt-1">
                          <Badge className={`text-xs ${getStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </Badge>
                          <Badge className={`text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Order Status */}
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl">
                      {getStatusIcon(order.order_status)}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 capitalize">{order.order_status}</p>
                        <p className="text-sm text-gray-600">
                          {order.order_status === "delivered"
                            ? "Your order has been delivered"
                            : order.order_status === "shipped"
                              ? "Your order is on the way"
                              : order.order_status === "confirmed"
                                ? "Your order has been confirmed"
                                : "Your order is being processed"}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × {item.price.toFixed(2)} birr
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">+{order.items.length - 2} more items</p>
                      )}
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleViewOrder(order)}
                        variant="outline"
                        className="flex-1 border-amber-300 text-amber-600 hover:bg-amber-50"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {order.order_status === "delivered" && (
                        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">Reorder</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Modal */}
        <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
          <DialogContent className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800">
                Order #{selectedOrder?.order_number}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                {/* Order Status */}
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl">
                  {getStatusIcon(selectedOrder.order_status)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 capitalize">{selectedOrder.order_status}</p>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(selectedOrder.order_status)}`}>
                      {selectedOrder.order_status}
                    </Badge>
                    <Badge className={`text-xs mt-1 ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Customer Information</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Name: {selectedOrder.customer_name}</p>
                    <p>Phone: {selectedOrder.customer_phone}</p>
                    <p>Address: {selectedOrder.shipping_address}</p>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Order Items</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × {item.price.toFixed(2)} birr = {(item.quantity * item.price).toFixed(2)}{" "}
                          birr
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Summary */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Order Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        {(selectedOrder.total_amount - selectedOrder.delivery_fee - selectedOrder.service_fee).toFixed(
                          2,
                        )}{" "}
                        birr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">{selectedOrder.delivery_fee.toFixed(2)} birr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">{selectedOrder.service_fee.toFixed(2)} birr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-amber-600">
                      <span>Total:</span>
                      <span>{selectedOrder.total_amount.toFixed(2)} birr</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
