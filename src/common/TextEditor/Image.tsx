"use client"

import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"

interface ImageResizeHandlesProps {
  imgElement: HTMLImageElement
  parentContainerRef: React.RefObject<HTMLElement>
  onResize: () => void
  onDeselect: () => void
}

const ImageResizeHandles: React.FC<ImageResizeHandlesProps> = ({
  imgElement,
  parentContainerRef,
  onResize,
  onDeselect,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const startWidth = useRef(0)
  const startHeight = useRef(0)
  const startLeft = useRef(0)
  const startTop = useRef(0)
  const activeHandle = useRef<string | null>(null)

  const updatePositionAndSize = useCallback(() => {
    if (imgElement && parentContainerRef.current) {
      const imgRect = imgElement.getBoundingClientRect()
      const parentRect = parentContainerRef.current.getBoundingClientRect()

      // Calculate position relative to the parent container's scrollable area
      const newX = imgRect.left - parentRect.left + parentContainerRef.current.scrollLeft
      const newY = imgRect.top - parentRect.top + parentContainerRef.current.scrollTop
      const newWidth = imgRect.width
      const newHeight = imgRect.height

      setPosition({ x: newX, y: newY })
      setSize({ width: newWidth, height: newHeight })

      // Apply styles directly here to avoid dependency loop in useEffect
      imgElement.style.position = "absolute"
      imgElement.style.left = `${newX}px`
      imgElement.style.top = `${newY}px`
      imgElement.style.width = `${newWidth}px`
      imgElement.style.height = `${newHeight}px`
    }
  }, [imgElement, parentContainerRef])

  useEffect(() => {
    // Initial position and size setup
    updatePositionAndSize()

    imgElement.style.cursor = "grab" // Set cursor for dragging
    imgElement.style.pointerEvents = "auto" // Ensure image can be clicked/dragged

    const handleLoad = () => {
      // Re-calculate position and size after image loads to get natural dimensions
      updatePositionAndSize()
      onResize() // Notify parent that image might have resized after load
    }

    imgElement.addEventListener("load", handleLoad)

    // Add a global click listener to deselect the image when clicking outside
    const handleGlobalClick = (event: MouseEvent) => {
      if (!imgElement.contains(event.target as Node) && !parentContainerRef.current?.contains(event.target as Node)) {
        onDeselect()
      }
    }

    document.addEventListener("mousedown", handleGlobalClick)

    return () => {
      imgElement.removeEventListener("load", handleLoad)
      document.removeEventListener("mousedown", handleGlobalClick)
      imgElement.style.cursor = "" // Reset cursor
      imgElement.style.pointerEvents = "" // Reset pointer events
    }
  }, [
    imgElement,
    parentContainerRef,
    onResize,
    onDeselect,
    updatePositionAndSize, // This useCallback is stable unless its dependencies change
  ])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.stopPropagation() // Prevent editor click from deselecting
      e.preventDefault() // Prevent default drag behavior

      setIsResizing(true)
      activeHandle.current = handle
      startX.current = e.clientX
      startY.current = e.clientY
      startWidth.current = imgElement.offsetWidth
      startHeight.current = imgElement.offsetHeight
      startLeft.current = imgElement.offsetLeft
      startTop.current = imgElement.offsetTop

      imgElement.style.pointerEvents = "none" // Disable pointer events on image during resize/drag
    },
    [imgElement],
  )

  const handleImageMouseDown = useCallback(
    (e: MouseEvent) => {
      // Changed from React.MouseEvent to MouseEvent
      e.stopPropagation() // Prevent editor click from deselecting
      e.preventDefault() // Prevent default drag behavior

      setIsDragging(true)
      startX.current = e.clientX
      startY.current = e.clientY
      startLeft.current = imgElement.offsetLeft
      startTop.current = imgElement.offsetTop

      imgElement.style.cursor = "grabbing"
      imgElement.style.pointerEvents = "none" // Disable pointer events on image during resize/drag
    },
    [imgElement],
  )

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!imgElement || !parentContainerRef.current) return

      const parentRect = parentContainerRef.current.getBoundingClientRect()
      const minWidth = 50
      const minHeight = 50

      if (isResizing && activeHandle.current) {
        const dx = e.clientX - startX.current
        const dy = e.clientY - startY.current

        let newWidth = startWidth.current
        let newHeight = startHeight.current
        let newLeft = startLeft.current
        let newTop = startTop.current

        switch (activeHandle.current) {
          case "top-left":
            newWidth = Math.max(minWidth, startWidth.current - dx)
            newHeight = Math.max(minHeight, startHeight.current - dy)
            newLeft = startLeft.current + (startWidth.current - newWidth)
            newTop = startTop.current + (startHeight.current - newHeight)
            break
          case "top-right":
            newWidth = Math.max(minWidth, startWidth.current + dx)
            newHeight = Math.max(minHeight, startHeight.current - dy)
            newTop = startTop.current + (startHeight.current - newHeight)
            break
          case "bottom-left":
            newWidth = Math.max(minWidth, startWidth.current - dx)
            newHeight = Math.max(minHeight, startHeight.current + dy)
            newLeft = startLeft.current + (startWidth.current - newWidth)
            break
          case "bottom-right":
            newWidth = Math.max(minWidth, startWidth.current + dx)
            newHeight = Math.max(minHeight, startHeight.current + dy)
            break
        }

        // Aspect ratio lock (optional, but good for images)
        const aspectRatio = startWidth.current / startHeight.current
        if (activeHandle.current.includes("left") || activeHandle.current.includes("right")) {
          newHeight = newWidth / aspectRatio
        } else {
          newWidth = newHeight * aspectRatio
        }

        // Boundary checks for resizing
        newWidth = Math.min(newWidth, parentRect.width - (newLeft - parentContainerRef.current.scrollLeft))
        newHeight = Math.min(newHeight, parentRect.height - (newTop - parentContainerRef.current.scrollTop))

        // Ensure min dimensions
        newWidth = Math.max(minWidth, newWidth)
        newHeight = Math.max(minHeight, newHeight)

        // Re-calculate position based on new size to stay within bounds
        if (newLeft < 0) newLeft = 0
        if (newTop < 0) newTop = 0
        if (newLeft + newWidth > parentRect.width + parentContainerRef.current.scrollLeft) {
          newLeft = parentRect.width + parentContainerRef.current.scrollLeft - newWidth
        }
        if (newTop + newHeight > parentRect.height + parentContainerRef.current.scrollTop) {
          newTop = parentRect.height + parentContainerRef.current.scrollTop - newHeight
        }

        imgElement.style.width = `${newWidth}px`
        imgElement.style.height = `${newHeight}px`
        imgElement.style.left = `${newLeft}px`
        imgElement.style.top = `${newTop}px`

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newLeft, y: newTop })
      } else if (isDragging) {
        let newLeft = startLeft.current + (e.clientX - startX.current)
        let newTop = startTop.current + (e.clientY - startY.current)

        // Boundary checks for dragging
        const maxLeft = parentRect.width + parentContainerRef.current.scrollLeft - imgElement.offsetWidth
        const maxTop = parentRect.height + parentContainerRef.current.scrollTop - imgElement.offsetHeight

        newLeft = Math.max(0, Math.min(newLeft, maxLeft))
        newTop = Math.max(0, Math.min(newTop, maxTop))

        imgElement.style.left = `${newLeft}px`
        imgElement.style.top = `${newTop}px`

        setPosition({ x: newLeft, y: newTop })
      }
    },
    [imgElement, isResizing, isDragging, parentContainerRef],
  )

  const handleGlobalMouseUp = useCallback(() => {
    if (isResizing || isDragging) {
      setIsResizing(false)
      setIsDragging(false)
      activeHandle.current = null
      imgElement.style.cursor = "grab" // Restore grab cursor
      imgElement.style.pointerEvents = "auto" // Re-enable pointer events on image
      onResize() // Notify parent that resize/drag has ended
    }
  }, [isResizing, isDragging, imgElement, onResize])

  useEffect(() => {
    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [handleGlobalMouseMove, handleGlobalMouseUp])

  // Set up mouse down listener on the image itself for dragging
  useEffect(() => {
    imgElement.addEventListener("mousedown", handleImageMouseDown) // Removed 'as any'
    return () => {
      imgElement.removeEventListener("mousedown", handleImageMouseDown) // Removed 'as any'
    }
  }, [imgElement, handleImageMouseDown])

  if (!imgElement) return null

  return (
    <>
      {/* Handles */}
      <div
        className="absolute w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nwse-resize"
        style={{ top: position.y - 8, left: position.x - 8 }}
        onMouseDown={(e) => handleMouseDown(e, "top-left")}
      />
      <div
        className="absolute w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nesw-resize"
        style={{ top: position.y - 8, left: position.x + size.width - 8 }}
        onMouseDown={(e) => handleMouseDown(e, "top-right")}
      />
      <div
        className="absolute w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nesw-resize"
        style={{ top: position.y + size.height - 8, left: position.x - 8 }}
        onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
      />
      <div
        className="absolute w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nwse-resize"
        style={{ top: position.y + size.height - 8, left: position.x + size.width - 8 }}
        onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
      />
      {/* Outline */}
      <div
        className="absolute border-2 border-blue-500 pointer-events-none"
        style={{
          top: position.y,
          left: position.x,
          width: size.width,
          height: size.height,
        }}
      />
    </>
  )
}

export default ImageResizeHandles