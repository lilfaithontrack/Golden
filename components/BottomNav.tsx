"use client"

import { useEffect, useState } from "react"
import { Home, Grid3X3, ShoppingCart, Store, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
    setCartCount(count)
  }

  useEffect(() => {
    updateCartCount()

    const handleCartUpdate = () => updateCartCount()
    window.addEventListener("cartUpdated", handleCartUpdate)

    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      clearInterval(interval)
    }
  }, [])

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Categories", icon: Grid3X3, path: "/categories" },
    { name: "Cart", icon: ShoppingCart, path: "/cart" },
    { name: "Shop", icon: Store, path: "/shop" },
    { name: "Account", icon: User, path: "/account" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = pathname === item.path

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${
                  isActive
                    ? "bg-gradient-to-t from-amber-500 to-amber-400 text-white shadow-lg scale-105"
                    : "text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                }`}
              >
                <div className="relative">
                  <IconComponent className="w-5 h-5 mb-1" />
                  {item.name === "Cart" && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-white" : ""}`}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
