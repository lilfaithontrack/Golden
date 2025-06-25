"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Subcategory {
  id: number
  name: string
  image: string
}

interface Category {
  id: number
  name: string
  image: string
  subcats: Subcategory[]
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("https://backend.yeniesuq.com/api/catitem/")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        setCategories(data)
      } else {
        throw new Error("Unexpected data format from API")
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError(`Network Error: ${err instanceof Error ? err.message : "Unknown error"}`)

      // Fallback to mock data
      const mockCategories: Category[] = [
        {
          id: 1,
          name: "Electronics",
          image: "/placeholder.svg?height=60&width=60",
          subcats: [
            { id: 1, name: "Phones", image: "/placeholder.svg?height=40&width=40" },
            { id: 2, name: "Laptops", image: "/placeholder.svg?height=40&width=40" },
          ],
        },
        {
          id: 2,
          name: "Fashion",
          image: "/placeholder.svg?height=60&width=60",
          subcats: [
            { id: 3, name: "Clothing", image: "/placeholder.svg?height=40&width=40" },
            { id: 4, name: "Shoes", image: "/placeholder.svg?height=40&width=40" },
          ],
        },
      ]
      setCategories(mockCategories)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedCategory(null)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-center text-red-600 bg-red-50 p-4 rounded-xl">
            <AlertTriangle className="mr-2 w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">Shop by Category</h2>

        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="flex-shrink-0 flex flex-col items-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-md flex items-center justify-center mb-2 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border border-amber-200">
                <Image
                  src={category.image ? `https://backend.yeniesuq.com${category.image}` : "/placeholder.svg"}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="rounded-xl object-cover"
                />
              </div>
              <p className="text-xs font-medium text-gray-700 text-center max-w-[60px] leading-tight">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="max-w-sm mx-auto bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800 text-center">
              {selectedCategory?.name || "Subcategories"}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            {selectedCategory?.subcats && selectedCategory.subcats.length > 0 ? (
              <div className="space-y-3">
                {selectedCategory.subcats.map((subcategory) => (
                  <Link href={`/subshop/${subcategory.id}`} key={subcategory.id} onClick={closeModal}>
                    <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-amber-100 hover:border-amber-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mr-3">
                        <Image
                          src={
                            subcategory.image ? `https://backend.yeniesuq.com/${subcategory.image}` : "/placeholder.svg"
                          }
                          alt={subcategory.name}
                          width={24}
                          height={24}
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{subcategory.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No subcategories available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
