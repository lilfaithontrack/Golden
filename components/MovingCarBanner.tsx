"use client"

import { Truck, Clock, Shield, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function MovingCarBanner() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Same day delivery available",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round the clock support",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your money is safe with us",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Always here to help",
    },
  ]

  return (
    <div className="px-4 py-2">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="flex-shrink-0 flex items-center space-x-3 text-white min-w-[200px]">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-white/80">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
