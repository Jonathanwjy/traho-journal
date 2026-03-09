import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const hexToRgb = hex => {
  const validHex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(hex)
  if (!validHex) return null

  let cleanHex = hex.replace("#", "")

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("")
  }

  const bigint = parseInt(cleanHex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `${r}, ${g}, ${b}`
}

export function ImageSplit({
  src,
  sections = 9,
  offsetStep = 30,
  initialBorderOpacity = 0.4,
  enableBorder = true,
  borderColor = "#ffffff",
  viewportThreshold = 0.3,
  className,
  ...props
}) {
  const [imagePieces, setImagePieces] = useState([])
  const [borderOpacity, setBorderOpacity] =
    useState(initialBorderOpacity)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef(null)
  const parentRef = useRef(null)
  const imgRefs = useRef([])
  const scrollContainerRef = useRef(null)
  const animationFrameRef = useRef(0)
  const borderRgb = hexToRgb(borderColor) || "255, 255, 255"

  useEffect(() => {
    const image = new Image()
    image.src = src
    image.onload = () => cutImageUp(image)
  }, [src, sections])

  useEffect(() => {
    setBorderOpacity(progress * initialBorderOpacity)
  }, [progress])

  useEffect(() => {
    const parent = parentRef.current
    if (!parent) return

    scrollContainerRef.current = getScrollParent(parent)
    setupScrollListener()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    };
  }, [])

  const getScrollParent = element => {
    while (element) {
      const style = getComputedStyle(element)
      if (["auto", "scroll"].includes(style.overflowY)) return element
      if (!element.parentElement) return null
      element = element.parentElement
    }
    return null
  }

  const setupScrollListener = () => {
    const scrollContainer = scrollContainerRef.current
    const parent = parentRef.current
    if (!parent) return

    const updateProgress = () => {
      const parentRect = parent.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      let progress
      if (scrollContainer instanceof HTMLElement) {
        const scrollContainerRect = scrollContainer.getBoundingClientRect()
        const start = scrollContainerRect.bottom
        const end = scrollContainerRect.top + viewportHeight * viewportThreshold
        const current = parentRect.top
        progress = (current - end) / (start - end)
      } else {
        const startTrigger = viewportHeight * viewportThreshold
        const elementTop = parentRect.top
        const elementHeight = parentRect.height

        progress =
          (elementTop - startTrigger) /
          (viewportHeight - elementHeight - startTrigger)
      }

      progress = Math.min(1, Math.max(0, progress))
      setProgress(progress)

      imgRefs.current.forEach((img, index) => {
        if (!img) return
        const offset = getOffset(index)
        img.style.transform = `translateY(${offset * progress}px)`
      })
    }

    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }

    const target = scrollContainer || window
    target.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => target.removeEventListener("scroll", handleScroll);
  }

  const cutImageUp = (image) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const pieceWidth = Math.floor(image.width / sections)
    const pieceHeight = image.height
    const context = canvas.getContext("2d")
    if (!context) return

    const newImagePieces = []
    for (let i = 0; i < sections; i++) {
      canvas.width = pieceWidth
      canvas.height = pieceHeight
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(
        image,
        i * pieceWidth,
        0,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      )
      newImagePieces.push(canvas.toDataURL())
    }
    setImagePieces(newImagePieces)
  }

  const getOffset = (index) => {
    if (index === 0 || index === sections - 1) return 0
    return Math.min(index, sections - 1 - index) * offsetStep;
  }

  return (
    <div
      ref={parentRef}
      className={cn("relative flex w-full rounded-[inherit]", className)}
      {...props}>
      <canvas ref={canvasRef} className="hidden" />
      {imagePieces.map((piece, index) => (
        <img
          key={index}
          src={piece}
          alt={`section-${index}`}
          ref={(el) => {
            imgRefs.current[index] = el
          }}
          className={cn("object-contain transition-transform duration-300 ease-out", {
            "rounded-l-[inherit]": index === 0,
            "rounded-r-[inherit]": index === imagePieces.length - 1,
          })}
          style={{
            width: `${100 / sections}%`,
            transform: `translateY(${getOffset(index)}px)`,
            zIndex: sections - index,
            borderRight:
              enableBorder && index !== imagePieces.length - 1
                ? `1px solid rgba(${borderRgb}, ${borderOpacity})`
                : "none",
            marginRight:
              enableBorder && index !== imagePieces.length - 1 ? "-1px" : "0",
            boxSizing: "border-box",
          }} />
      ))}
    </div>
  );
}
