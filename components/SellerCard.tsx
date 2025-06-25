"use client"

import { Star, Store, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SellerCard() {
  const featuredSellers = [
    {
      id: 1,
      name: "TechHub Store",
      rating: 4.8,
      products: 156,
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
      category: "Electronics",
    },
    {
      id: 2,
      name: "Fashion Forward",
      rating: 4.9,
      products: 89,
      image: "/placeholder.svg?height=60&width=60",
      verified: true,
      category: "Fashion",
    },
    {
      id: 3,
      name: "Home Essentials",
      rating: 4.7,
      products: 234,
      image: "/placeholder.svg?height=60&width=60",
      verified: false,
      category: "Home & Garden",
    },
  ]

  return (
    <div className="px-4 py-6">
      <Card className="border-0 shadow-lg bg-white rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
            <Store className="w-5 h-5 text-amber-500 mr-2" />
            Featured Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuredSellers.map((seller) => (
              <Link key={seller.id} href={`/seller/${seller.id}`}>
                <div className="flex items-center space-x-4 p-3 bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-100 hover:shadow-md transition-all duration-200 hover:border-amber-200">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl overflow-hidden">
                      <Image
                        src={seller.image || "/placeholder.svg"}
                        alt={seller.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    {seller.verified && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{seller.name}</h3>
                      {seller.verified && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600">{seller.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{seller.products} products</span>
                    </div>

                    <p className="text-xs text-amber-600 font-medium mt-1">{seller.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
