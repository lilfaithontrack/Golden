"use client"
import { ChevronRight, Smartphone, Laptop, Headphones, Camera, Watch, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function MobileSlider() {
  const quickCategories = [
    { id: 1, name: "Phones", icon: Smartphone, color: "from-blue-400 to-blue-600" },
    { id: 2, name: "Laptops", icon: Laptop, color: "from-purple-400 to-purple-600" },
    { id: 3, name: "Audio", icon: Headphones, color: "from-green-400 to-green-600" },
    { id: 4, name: "Cameras", icon: Camera, color: "from-red-400 to-red-600" },
    { id: 5, name: "Watches", icon: Watch, color: "from-amber-400 to-amber-600" },
    { id: 6, name: "Gaming", icon: Gamepad2, color: "from-indigo-400 to-indigo-600" },
  ]

  return (
    <div className="px-4 py-2">
      <Card className="border-0 shadow-lg bg-white rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Quick Shop</h3>
            <Link href="/categories" className="text-amber-600 text-sm font-medium flex items-center">
              All Categories
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {quickCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <div className="flex-shrink-0 flex flex-col items-center group">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl shadow-md flex items-center justify-center mb-2 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-center max-w-[56px] leading-tight">
                      {category.name}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
