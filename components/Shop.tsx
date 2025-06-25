"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Product from "./Product"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductType {
  id: number
  title: string
  price: number
  description?: string
  category?: string
  stock?: string
  image?: string
  imageUrl?: string
  productfor?: string
}

export default function Shop() {
  const [products, setProducts] = useState<ProductType[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({ productFor: "for_user" })

  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("q") || ""

  const processProductImage = useCallback((product: any): ProductType => {
    let imageUrl = "/placeholder.svg?height=300&width=300"
    try {
      if (product.image) {
        // Handle array format from your API
        const imageArray = JSON.parse(product.image.replace(/'/g, '"'))
        if (Array.isArray(imageArray) && imageArray.length > 0) {
          const imagePath = imageArray[0].startsWith("/") ? imageArray[0] : `/${imageArray[0]}`
          imageUrl = `https://backend.yeniesuq.com${imagePath}`
        }
      } else if (typeof product.image === "string" && product.image.startsWith("http")) {
        imageUrl = product.image
      } else if (typeof product.image === "string" && product.image.trim() !== "") {
        const imagePath = product.image.startsWith("/") ? product.image : `/${product.image}`
        imageUrl = `https://backend.yeniesuq.com${imagePath}`
      }
    } catch (error) {
      console.warn("Error processing image URL for product:", product.title, error)
    }
    return { ...product, imageUrl }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let mainApiUrl = "https://backend.yeniesuq.com/api/prod"
      mainApiUrl += `?mode=${filters.productFor}`

      let sellerProductsData: ProductType[] = []
      if (filters.productFor === "for_user") {
        try {
          const sellerResponse = await fetch("https://backend.yeniesuq.com/api/sellerproduct/approved")
          if (sellerResponse.ok) {
            const sellerData = await sellerResponse.json()
            sellerProductsData = sellerData.map(processProductImage).map((p: any) => ({ ...p, productfor: "for_user" }))
          } else {
            console.warn("Failed to fetch seller products.")
          }
        } catch (sellerErr) {
          console.warn("Error fetching seller products:", sellerErr)
        }
      }

      const mainResponse = await fetch(mainApiUrl)
      if (!mainResponse.ok) {
        throw new Error(`Failed to fetch products for ${filters.productFor}.`)
      }

      const mainProductsData = (await mainResponse.json()).map(processProductImage)
      const combinedProducts = [...mainProductsData, ...sellerProductsData]
      setProducts(combinedProducts)

      console.log("Fetched products for filter:", filters.productFor)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(
        !navigator.onLine
          ? "No internet connection. Please check your connection."
          : err instanceof Error
            ? err.message
            : "Unknown error",
      )

      // Fallback to mock data
      const mockProducts: ProductType[] = [
        {
          id: 1,
          title: "Premium Smartphone",
          price: 25000,
          description: "Latest smartphone with advanced features",
          category: "Electronics",
          stock: "in_stock",
          productfor: "for_user",
        },
        {
          id: 2,
          title: "Wireless Headphones",
          price: 5500,
          description: "High-quality wireless headphones",
          category: "Electronics",
          stock: "in_stock",
          productfor: "for_user",
        },
        {
          id: 3,
          title: "Business Laptop",
          price: 45000,
          description: "Professional laptop for business use",
          category: "Electronics",
          stock: "limited_stock",
          productfor: "for_seller",
        },
      ]

      const processedProducts = mockProducts.filter((p) => p.productfor === filters.productFor).map(processProductImage)

      setProducts(processedProducts)
    } finally {
      setLoading(false)
    }
  }, [filters.productFor, processProductImage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products)
      return
    }
    const lowercasedQuery = searchQuery.toLowerCase()
    const newlyFiltered = products.filter(
      (product) =>
        product.title?.toLowerCase().includes(lowercasedQuery) ||
        product.description?.toLowerCase().includes(lowercasedQuery) ||
        product.category?.toLowerCase().includes(lowercasedQuery),
    )
    setFilteredProducts(newlyFiltered)
  }, [searchQuery, products])

  const addToCart = (product: ProductType) => {
    if (product.stock === "out_of_stock") {
      toast.error(`${product.title} is out of stock.`)
      return
    }
    if (product.stock === "limited_stock") {
      toast.warning(`${product.title} has limited stock. Hurry up!`)
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id && item.title === product.title)
    if (existingProductIndex > -1) {
      toast.info(`${product.title} is already in the cart.`)
    } else {
      const price = Number.parseFloat(product.price.toString())
      if (isNaN(price)) {
        toast.error(`Invalid price for ${product.title}. Cannot add to cart.`)
        return
      }
      cart.push({
        id: product.id,
        title: product.title,
        price: price,
        quantity: 1,
        image: product.imageUrl,
        productfor: product.productfor,
      })
      localStorage.setItem("cart", JSON.stringify(cart))
      toast.success(`${product.title} added to cart!`)
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  if (loading && filteredProducts.length === 0 && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
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
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button onClick={fetchProducts} className="bg-amber-500 hover:bg-amber-600 text-white">
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
        {/* Filter Tabs */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
          <div className="flex">
            <button
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                filters.productFor === "for_user"
                  ? "border-amber-500 text-amber-600 bg-amber-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleFilterChange("productFor", "for_user")}
            >
              ለተጠቃሚ (For User)
            </button>
            <button
              className={`flex-1 py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                filters.productFor === "for_seller"
                  ? "border-amber-500 text-amber-600 bg-amber-50"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleFilterChange("productFor", "for_seller")}
            >
              ለነጋዴ (For Seller)
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
              {searchQuery && <span className="italic"> for "{searchQuery}"</span>}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Product
                  key={`${product.id}-${product.title}-${product.productfor}`}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {searchQuery ? `No results for "${searchQuery}"` : "No products found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse all products"
                    : "No products found for the selected category"}
                </p>
                <Button
                  onClick={() => handleFilterChange("productFor", "for_user")}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  View All Products
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
