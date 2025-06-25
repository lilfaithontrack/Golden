"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, User, Menu, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TopNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navItems = [
    { name: "Profile", icon: <User className="w-4 h-4" />, path: "/account" },
    { name: "Orders", icon: <ShoppingBag className="w-4 h-4" />, path: "/orders" },
    { name: "Login", icon: <User className="w-4 h-4" />, path: "/login" },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (pathname === "/shop") {
      const query = searchParams?.get("q") || ""
      setSearchTerm(query)
    }
  }, [pathname, searchParams])

  useEffect(() => {
    const token = localStorage.getItem("token")
    // You can use this to conditionally show/hide menu items
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push("/shop")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-amber-600 font-bold text-lg">Y</span>
          </div>
          <span className="font-bold text-lg hidden sm:block">Yene Suq</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50 rounded-full text-sm"
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white hover:bg-white/20 p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border-0 overflow-hidden">
              <div className="py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                      pathname === item.path
                        ? "bg-amber-50 text-amber-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
