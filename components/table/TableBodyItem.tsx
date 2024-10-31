"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TableBodyItemProps {
  text?: string
  children?: ReactNode,
  className?: string
}

export default function TableBodyItem ({
  text,
  children,
  className
}: TableBodyItemProps) {
  return (
    <td
      className={cn("pl-4 last:pr-4 py-2 text-xs font-medium border border-[#D9D9D9]", className)}
    >
      { text }
      { children }
    </td>
  )
}