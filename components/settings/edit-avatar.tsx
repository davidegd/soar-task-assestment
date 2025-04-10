"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import UserAvatarPlaceholder from "@/assets/images/user.png"

interface EditableAvatarProps {
  src: string
  alt: string
  size?: number
  className?: string
  onImageChange?: (file: File) => Promise<void>
}

export function EditableAvatar({
  src,
  alt,
  size = 128,
  className,
  onImageChange,
}: EditableAvatarProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Image must be less than 5MB",
      })
      return
    }

    if (onImageChange) {
      setIsLoading(true)
      try {
        await onImageChange(file)
        toast.success("Profile picture loaded successfully")
      } catch (error) {
        toast.error("Failed to load profile picture")
        console.error("Error updating profile picture:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div
      className={cn("relative inline-block md:flex", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-full border-4 border-background transition-opacity duration-200",
          isLoading && "opacity-70"
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={src ?? UserAvatarPlaceholder}
          alt={alt}
          width={size ?? 128}
          height={size ?? 128}
          className="h-full w-full object-cover"
        />

        {isHovering && !isLoading && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-200" />
        )}
      </div>

      <Button
        variant="default"
        size="icon"
        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-gray-900 text-white shadow-md hover:bg-gray-800"
        onClick={handleEditClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Pencil className="h-4 w-4" />
        )}
        <span className="sr-only">Change avatar</span>
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  )
}
