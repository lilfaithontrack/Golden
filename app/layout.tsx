import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import BottomNav from "@/components/BottomNav"
import TopNav from "@/components/TopNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Yene Suq - Your Premium Shopping Destination",
  description: "Discover amazing products at Yene Suq - Ethiopia's premier e-commerce platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yene Suq",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} bg-gradient-to-br from-amber-50 to-white min-h-screen overflow-x-hidden`}>
        <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative">
          <TopNav />
          <main className="flex-1 pt-16 pb-20 overflow-y-auto">{children}</main>
          <BottomNav />
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
