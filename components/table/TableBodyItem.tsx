"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface TableBodyItemProps {
  text?: string
  children?: ReactNode,
  className?: string
  explanation?: string
}

export default function TableBodyItem ({
  text,
  children,
  className,
  explanation
}: TableBodyItemProps) {
  return (
    <td
      title={explanation}
      className={cn("pl-4 last:pr-4 py-2 text-xs font-medium border border-[#D9D9D9]", className)}
    >
      { text }
      { children }
    </td>
  )
}