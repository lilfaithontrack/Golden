"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageCircle,
  ThumbsUp,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ProductType {
  id: number
  title: string
  name: string
  price: number
  description: string
  category: string
  stock: string
  images: string[]
  rating: number
  reviewCount: number
  seller?: {
    id: number
    name: string
    rating: number
    verified: boolean
  }
  specifications?: { [key: string]: string }
  features?: string[]
}

interface Review {
  id: number
  user: string
  rating: number
  comment: string
  date: string
  helpful: number
  avatar?: string
}

interface RelatedProduct {
  id: number
  title: string
  price: number
  image: string
  rating: number
}

export default function ProductDetail() {
  const { productId } = useParams()
  const router = useRouter()

  const [product, setProduct] = useState<ProductType | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch product details
        const response = await fetch(`https://backend.yeniesuq.com/api/prod/${productId}`)

        if (!response.ok) {
          throw new Error("Product not found")
        }

        const data = await response.json()

        // Process product data with the new structure
        let images = ["/placeholder.svg?height=400&width=400"]
        try {
          if (data.image) {
            const imageArray = JSON.parse(data.image)
            if (Array.isArray(imageArray) && imageArray.length > 0) {
              images = imageArray.map((img: string) => `https://backend.yeniesuq.com${img}`)
            }
          }
        } catch (error) {
          console.warn("Error parsing product images:", error)
        }

        // Handle location-based pricing
        let finalPrice = data.price
        let finalStock = data.stock

        try {
          if (data.location_prices) {
            const locationPrices = JSON.parse(data.location_prices)
            // Use Addis Ababa price if available, otherwise use default price
            finalPrice = locationPrices["Addis Ababa"] || data.price
          }

          if (data.location_stock) {
            const locationStock = JSON.parse(data.location_stock)
            // Use Addis Ababa stock if available, otherwise use default stock
            finalStock = locationStock["Addis Ababa"] || data.stock
          }
        } catch (error) {
          console.warn("Error parsing location data:", error)
        }

        const processedProduct: ProductType = {
          ...data,
          title: data.title,
          price: Number(finalPrice),
          stock: finalStock,
          images,
          rating: 4.2, // Mock rating
          reviewCount: 156, // Mock review count
          seller: {
            id: 1,
            name: data.brand || "Yene Suq Store",
            rating: 4.8,
            verified: true,
          },
          specifications: {
            Brand: data.brand || "Premium Brand",
            Location: data.location_name || "Addis Ababa",
            Category: data.catItems || "General",
            Status: data.status || "Available",
            "Product For": data.productfor === "for_seller" ? "Business/Seller" : "Individual Customer",
          },
          features: [
            "Fresh Quality Guaranteed",
            "Same Day Delivery Available",
            "Direct from Local Suppliers",
            "Quality Checked Products",
          ],
        }

        setProduct(processedProduct)

        // Mock reviews data (same as before)
        const mockReviews: Review[] = [
          {
            id: 1,
            user: "አበበ ተ.",
            rating: 5,
            comment: "በጣም ጥሩ ጥራት ያለው ምርት! በፍጥነት ደርሶኛል።",
            date: "2024-01-15",
            helpful: 12,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 2,
            user: "ሳራ መ.",
            rating: 4,
            comment: "ለገንዘቡ ጥሩ ዋጋ። ምርቱ ከመግለጫው ጋር ይመሳሰላል።",
            date: "2024-01-10",
            helpful: 8,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 3,
            user: "አህመድ ከ.",
            rating: 5,
            comment: "ፈጣን ማድረስ እና ጥሩ የደንበኛ አገልግሎት። በጣም እመክራለሁ!",
            date: "2024-01-05",
            helpful: 15,
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ]
        setReviews(mockReviews)

        // Mock related products based on category
        const mockRelated: RelatedProduct[] = [
          {
            id: 101,
            title: "ካሮት 30-60",
            price: Number(finalPrice) * 0.8,
            image: "/placeholder.svg?height=150&width=150",
            rating: 4.1,
          },
          {
            id: 102,
            title: "ቲማቲም 25-45",
            price: Number(finalPrice) * 1.2,
            image: "/placeholder.svg?height=150&width=150",
            rating: 4.5,
          },
          {
            id: 103,
            title: "ሽንኩርት 15-35",
            price: Number(finalPrice) * 0.9,
            image: "/placeholder.svg?height=150&width=150",
            rating: 4.3,
          },
        ]
        setRelatedProducts(mockRelated)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err instanceof Error ? err.message : "Failed to load product")

        // Fallback mock data
        const mockProduct: ProductType = {
          id: Number(productId),
          title: "ብሮኪሊ 20-50",
          name: "ብሮኪሊ 20-50",
          price: 175,
          description:
            "Piaz Delivery is a service dedicated to delivering goods, including fresh vegetables, directly to customers.",
          category: "Vegetables",
          stock: "in_stock",
          images: ["/placeholder.svg?height=400&width=400"],
          rating: 4.2,
          reviewCount: 156,
          seller: {
            id: 1,
            name: "በላይ አትክልትና አስቤዛ",
            rating: 4.8,
            verified: true,
          },
          specifications: {
            Brand: "በላይ አትክልትና አስቤዛ",
            Location: "Addis Ababa",
            Category: "Fresh Vegetables",
            Status: "Available",
            "Product For": "Business/Seller",
          },
          features: [
            "Fresh Quality Guaranteed",
            "Same Day Delivery Available",
            "Direct from Local Suppliers",
            "Quality Checked Products",
          ],
        }
        setProduct(mockProduct)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProductDetail()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product) return

    if (product.stock === "out_of_stock") {
      toast.error(`${product.title} is out of stock.`)
      return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingProductIndex = cart.findIndex((item: any) => item.id === product.id)

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += quantity
      toast.success(`Updated ${product.title} quantity in cart!`)
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
      })
      toast.success(`${product.title} added to cart!`)
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Product link copied to clipboard!")
    }
  }

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const submitReview = () => {
    if (!newReview.trim()) {
      toast.error("Please write a review")
      return
    }

    const review: Review = {
      id: Date.now(),
      user: "You",
      rating: newRating,
      comment: newReview,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    }

    setReviews((prev) => [review, ...prev])
    setNewReview("")
    setNewRating(5)
    toast.success("Review submitted successfully!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-md mx-auto p-4">
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Not Found</h3>
              <p className="text-gray-500 mb-6">{error || "The product you're looking for doesn't exist."}</p>
              <Button onClick={() => router.back()} className="bg-amber-500 hover:bg-amber-600 text-white">
                Go Back
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
        <div className="sticky top-0 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold truncate mx-4">{product.title}</h1>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-white hover:bg-white/20">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="text-white hover:bg-white/20"
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Image Gallery */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 relative">
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover"
                />

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Stock Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant={product.stock === "in_stock" ? "secondary" : "destructive"}
                  className={product.stock === "in_stock" ? "bg-green-100 text-green-800" : ""}
                >
                  {product.stock === "in_stock"
                    ? "In Stock"
                    : product.stock === "limited_stock"
                      ? "Limited Stock"
                      : "Out of Stock"}
                </Badge>
              </div>

              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Product Info */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h1>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-4">{product.price.toFixed(2)} birr</p>
              </div>

              {/* Seller Info */}
              {product.seller && (
                <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-amber-700 font-semibold text-sm">{product.seller.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-800">{product.seller.name}</span>
                      {product.seller.verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-600">{product.seller.rating}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(1)} className="h-10 w-10 p-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === "out_of_stock"}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - {(product.price * quantity).toFixed(2)} birr
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="w-6 h-6 text-amber-500" />
                  <span className="text-xs text-gray-600">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="w-6 h-6 text-amber-500" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <RotateCcw className="w-6 h-6 text-amber-500" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card className="border-0 shadow-lg bg-white rounded-2xl">
            <div className="flex border-b">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-amber-500 text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <CardContent className="p-6">
              {activeTab === "description" && (
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  {product.features && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && product.specifications && (
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Write Review */}
                  <div className="space-y-3 p-4 bg-amber-50 rounded-xl">
                    <h4 className="font-semibold text-gray-800">Write a Review</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none">
                            <Star
                              className={`w-5 h-5 ${star <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="border-gray-200 focus:border-amber-500"
                    />
                    <Button onClick={submitReview} className="bg-amber-500 hover:bg-amber-600 text-white">
                      Submit Review
                    </Button>
                  </div>

                  <Separator />

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-gray-800">{review.user}</span>
                              <div className="flex space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <button className="flex items-center space-x-1 hover:text-amber-600">
                                <ThumbsUp className="w-3 h-3" />
                                <span>Helpful ({review.helpful})</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-amber-600">
                                <MessageCircle className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Card className="border-0 shadow-lg bg-white rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-800">Related Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {relatedProducts.map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      onClick={() => router.push(`/product/${relatedProduct.id}`)}
                      className="flex-shrink-0 w-32 cursor-pointer group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl mb-2 overflow-hidden group-hover:shadow-md transition-shadow">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.title}
                          width={128}
                          height={128}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-gray-800 text-xs leading-tight mb-1 line-clamp-2">
                        {relatedProduct.title}
                      </h4>
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600">{relatedProduct.rating}</span>
                      </div>
                      <p className="text-amber-600 font-bold text-sm">{relatedProduct.price.toFixed(2)} birr</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
