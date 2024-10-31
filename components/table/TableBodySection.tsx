"use client"

import { ReactNode } from "react"

interface TableBodySectionProps {
  children: ReactNode
}

export default function TableBodySection ({
  children
}: TableBodySectionProps) {
  return (
    <thead>
      { children }
    </thead>
  )
}