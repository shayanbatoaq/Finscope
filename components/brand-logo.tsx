import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  imageClassName?: string
  href?: string
  priority?: boolean
}

export function BrandLogo({
  className,
  imageClassName,
  href = "/",
  priority = false,
}: BrandLogoProps) {
  const logo = (
    <Image
      src="/finscope-ai-logo-cropped.png"
      alt="FinScope AI"
      width={760}
      height={315}
      priority={priority}
      className={cn("h-12 w-auto object-contain", imageClassName)}
    />
  )

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40", className)}
    >
      {logo}
    </Link>
  )
}
