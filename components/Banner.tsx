"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const advertisements = [
  {
    img: "/placeholder.svg?height=400&width=800",
    title: "Special Offers",
  },
  {
    img: "/placeholder.svg?height=400&width=800",
    title: "New Arrivals",
  },
  {
    img: "/placeholder.svg?height=400&width=800",
    title: "Best Deals",
  },
  {
    img: "/placeholder.svg?height=400&width=800",
    title: "Premium Collection",
  },
]

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart !== null && touchEnd !== null) {
      const swipeDistance = touchStart - touchEnd
      const threshold = 50
      if (swipeDistance > threshold) nextSlide()
      if (swipeDistance < -threshold) prevSlide()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  useEffect(() => {
    if (!isHovering) {
      const intervalId = setInterval(nextSlide, 4000)
      return () => clearInterval(intervalId)
    }
  }, [isHovering])

  return (
    <div className="px-4 pt-4 pb-2">
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
        style={{
          width: "100%",
          height: "200px",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {advertisements.map((ad, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image src={ad.img || "/placeholder.svg"} alt={`Slide ${index + 1}`} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white drop-shadow-lg">{ad.title}</h2>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {advertisements.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all duration-200"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all duration-200"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
