"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingCart, Heart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductProps {
  product: {
    id: number
    title: string
    price: number
    description?: string
    stock?: string
    imageUrl?: string
  }
  onAddToCart: (product: any) => void
}

export default function Product({ product, onAddToCart }: ProductProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking add to cart
    e.stopPropagation()
    onAddToCart(product)
  }

  const getStockBadge = () => {
    switch (product.stock) {
      case "out_of_stock":
        return (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        )
      case "limited_stock":
        return (
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
            Limited Stock
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
            In Stock
          </Badge>
        )
    }
  }

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="relative">
          <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 relative overflow-hidden">
            <Image
              src={
                imageError
                  ? "/placeholder.svg?height=200&width=200"
                  : product.imageUrl || "/placeholder.svg?height=200&width=200"
              }
              alt={product.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Stock Badge */}
          <div className="absolute top-2 left-2">{getStockBadge()}</div>

          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{product.title}</h3>

            {product.description && <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>}

            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">(4.0)</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-lg font-bold text-amber-600">
                  {Number.parseFloat(product.price.toString()).toFixed(2)} birr
                </p>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === "out_of_stock"}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
