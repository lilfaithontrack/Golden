"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // Show splash for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600"
        >
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <span className="text-amber-600 font-bold text-4xl">Y</span>
              </div>
            </motion.div>

            {/* App Name Animation */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">YENE SUQ</h1>
              <p className="text-white/90 text-lg font-medium">የኔ ሱቅ</p>
            </motion.div>

            {/* Tagline Animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-6"
            >
              <p className="text-white/80 text-sm">Your Premium Shopping Destination</p>
            </motion.div>

            {/* Loading Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-12"
            >
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 bg-white/60 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 right-16 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 bg-white rounded-full blur-2xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
