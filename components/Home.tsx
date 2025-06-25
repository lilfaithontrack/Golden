"use client"

import Banner from "./Banner"
import Categories from "./Categories"
import NewArrivals from "./NewArrivals"
import Shop from "./Shop"
import SplashScreen from "./SplashScreen"
import SellerCard from "./SellerCard"
import MobileSlider from "./MobileSlider"
import MovingCarBanner from "./MovingCarBanner"

export default function Home() {
  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <Banner />
        <MobileSlider />
        <Categories />
        <MovingCarBanner />
        <NewArrivals />
        <SellerCard />
        <Shop />
      </div>
    </>
  )
}
