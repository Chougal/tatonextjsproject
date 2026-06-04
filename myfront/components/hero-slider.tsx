"use client"

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    mainHeading: "Mega Dairy Tech Sale",
    subHeading: "Complete Dairy Management Software",
    priceText: "Starting ₹45,000",
    image: "/modern-dairy-farm.png",
    bgColor: "from-blue-100 to-white",
    discount: "Up to 10% Instant Discount",
    bank: "BOBCARD & HSBC"
  },
  {
    id: 2,
    mainHeading: "Jewellery Tech Expo",
    subHeading: "Gold & Jewellery Exchange Software",
    priceText: "Starting ₹30,000",
    image: "/modern-office-dashboard.png",
    bgColor: "from-amber-100 to-white",
    discount: "Flat 40% Off on License",
    bank: "HDFC & SBI"
  },
  {
    id: 3,
    mainHeading: "Industrial ERP Sale",
    subHeading: "Sugar Factory Management Systems",
    priceText: "Starting ₹1,20,000",
    image: "/indian-software-office-collaboration.png",
    bgColor: "from-red-100 to-white",
    discount: "Special Enterprise Pricing",
    bank: "ICICI & AXIS"
  }
]

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative overflow-hidden group" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className={`flex-[0_0_100%] min-w-0 relative h-[400px] bg-gradient-to-r ${slide.bgColor} flex items-center`}
          >
            <div className="container mx-auto px-12 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              {/* Left Content */}
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">{slide.mainHeading}</h2>
                <h3 className="text-2xl font-medium text-gray-700">{slide.subHeading}</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {slide.priceText}
                </div>
                
                <div className="bg-white/80 p-3 rounded-lg border border-gray-200 inline-block">
                  <p className="text-xs font-bold text-gray-500 uppercase">Bank Offer</p>
                  <p className="text-sm font-bold text-gray-900">{slide.discount}</p>
                  <p className="text-[10px] text-gray-500">*Using {slide.bank} Cards. T&C apply</p>
                </div>

                <div className="pt-2">
                  <Button className="bg-[#FFA41C] hover:bg-[#FA8900] text-black font-bold px-8 py-6 text-lg rounded-md shadow-md">
                    Shop Now
                  </Button>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative h-[300px] hidden md:block">
                <Image 
                  src={slide.image} 
                  alt={slide.mainHeading} 
                  fill 
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft className="w-8 h-8 text-gray-800" />
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight className="w-8 h-8 text-gray-800" />
      </button>
    </div>
  )
}
