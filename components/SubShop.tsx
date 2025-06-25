"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import Product from "./Product"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface ProductType {
  id: number
  name: string
  title: string
  price: number
  image: string
  imageUrl?: string
  stock?: string
}

export default function SubShop() {
  const { subcatId } = useParams()
  const [products, setProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addToCart = (product: ProductType) => {
    const newItem = {
      id: product.id,
      title: product.name || product.title,
      price: product.price,
      quantity: 1,
      image: product.imageUrl || `/placeholder.svg?height=200&width=200`,
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const productExists = existingCart.some((item: any) => item.id === newItem.id)

    if (productExists) {
      toast.info(`${product.name} is already in the cart.`)
    } else {
      existingCart.push(newItem)
      localStorage.setItem("cart", JSON.stringify(existingCart))
      toast.success(`${product.name} has been added to the cart!`)
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`https://backend.yeniesuq.com/api/prod?subcat=${subcatId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (Array.isArray(data) && data.length > 0) {
          const parsedProducts = data.map((product: any) => {
            let imageUrl = "/placeholder.svg?height=200&width=200" // Fallback image

            try {
              const imageArray = JSON.parse(product.image.replace(/'/g, '"'))
              if (Array.isArray(imageArray) && imageArray.length > 0) {
                imageUrl = `https://backend.yeniesuq.com${imageArray[0]}` // Use the first image URL
              }
            } catch (error) {
              console.error("Error parsing image URL array:", error)
            }

            return {
              ...product,
              imageUrl,
              title: product.name || product.title,
              name: product.name || product.title,
            }
          })

          setProducts(parsedProducts)
        } else {
          setError("No products found for this subcategory.")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Fallback to mock data
        const mockProducts: ProductType[] = [
          {
            id: 1,
            name: "Premium Product 1",
            title: "Premium Product 1",
            price: 1500,
            image: "/placeholder.svg?height=200&width=200",
            stock: "in_stock",
          },
          {
            id: 2,
            name: "Quality Item 2",
            title: "Quality Item 2",
            price: 2300,
            image: "/placeholder.svg?height=200&width=200",
            stock: "in_stock",
          },
        ]

        const processedProducts = mockProducts.map((product) => ({
          ...product,
          imageUrl: product.image,
        }))
        setProducts(processedProducts)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [subcatId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
              <p className="text-amber-600 font-medium">Loading products...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-600 text-white">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-white shadow-sm border-b p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-gray-800">Products</h1>
          </div>
        </div>

        <div className="p-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <Product
                  key={product.id}
                  product={{
                    ...product,
                    title: product.name || product.title,
                  }}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-500">No products available for this subcategory.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
