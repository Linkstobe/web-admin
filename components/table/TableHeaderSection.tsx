"use client"

import { ReactNode } from "react"

interface TableHeaderSectionProps {
  children: ReactNode
}

export default function TableHeaderSection ({
  children
}: TableHeaderSectionProps) {
  return (
    <thead
      className="w-full bg-green-900"
    >
      { children }
    </thead>
  )
}