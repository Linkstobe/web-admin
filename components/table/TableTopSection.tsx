"use client"

import { ReactNode } from "react"

interface TableTopSectionProps {
  children: ReactNode
}

export default function TableTopSection ({
  children
}: TableTopSectionProps) {
  return (
    <div
      className="flex justify-between items-center p-4"
    >
      { children }
    </div>
  )
}