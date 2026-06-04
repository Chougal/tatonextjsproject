"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function RevealOnScroll({ children, className = "", delay = 0 }: RevealOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.15,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
