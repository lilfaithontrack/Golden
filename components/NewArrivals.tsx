"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import Product from "./Product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ProductType {
  id: number
  title: string
  price: number
  description?: string
  stock?: string
  imageUrl?: string
}

export default function NewArrivals() {
  const [newProducts, setNewProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true)
      try {
        // Fetch latest products from API
        const response = await fetch("https://backend.yeniesuq.com/api/prod?latest=true&limit=4")

        if (response.ok) {
          const data = await response.json()
          const processedProducts = data.map((product: any) => {
            let imageUrl = "/placeholder.svg?height=200&width=200"
            try {
              if (product.image) {
                const imageArray = JSON.parse(product.image.replace(/'/g, '"'))
                if (Array.isArray(imageArray) && imageArray.length > 0) {
                  imageUrl = `https://backend.yeniesuq.com${imageArray[0]}`
                }
              }
            } catch (error) {
              console.warn("Error processing image for product:", product.title)
            }
            return {
              ...product,
              imageUrl,
              title: product.name || product.title,
            }
          })
          setNewProducts(processedProducts)
        } else {
          throw new Error("Failed to fetch new products")
        }
      } catch (error) {
        console.error("Error fetching new products:", error)

        // Fallback to mock data
        const mockNewProducts: ProductType[] = [
          {
            id: 1,
            title: "Latest Smartphone Pro",
            price: 28000,
            description: "Brand new flagship smartphone",
            stock: "in_stock",
            imageUrl: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 2,
            title: "Wireless Earbuds Pro",
            price: 4500,
            description: "Premium wireless earbuds",
            stock: "in_stock",
            imageUrl: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 3,
            title: "Smart Watch Series X",
            price: 12000,
            description: "Advanced fitness tracking",
            stock: "limited_stock",
            imageUrl: "/placeholder.svg?height=200&width=200",
          },
          {
            id: 4,
            title: "Gaming Laptop Ultra",
            price: 55000,
            description: "High-performance gaming laptop",
            stock: "in_stock",
            imageUrl: "/placeholder.svg?height=200&width=200",
          },
        ]
        setNewProducts(mockNewProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchNewProducts()
  }, [])

  const addToCart = (product: ProductType) => {
    if (product.stock === "out_of_stock") {
      toast.error(`${product.title} is out of stock.`)
      return
    }
    if (product.stock === "limited_stock") {
      toast.warning(`${product.title} has limited stock. Hurry up!`)
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id)
    if (existingProductIndex > -1) {
      toast.info(`${product.title} is already in the cart.`)
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.imageUrl,
      })
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(`${product.title} added to cart!`)
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6">
        <Card className="border-0 shadow-lg bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      <Card className="border-0 shadow-lg bg-white rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800">🆕 New Arrivals</CardTitle>
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {newProducts.slice(0, 4).map((product) => (
              <Product key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
