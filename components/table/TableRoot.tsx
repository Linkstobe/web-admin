"use client"

import { ReactNode } from "react"

interface TableRootProps {
  children: ReactNode
}

export default function TableRoot ({
  children
}: TableRootProps) {
  return (
    <div
      className="bg-white shadow-md rounded-lg w-full"
    >
      { children }
    </div>
  )
}