"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TableRootProps {
  children: ReactNode
  className?: string
}

export default function TableRoot ({
  children,
  className
}: TableRootProps) {
  return (
    <div
      className={cn("bg-white shadow-md rounded-lg w-full", className)}
    >
      { children }
    </div>
  )
}