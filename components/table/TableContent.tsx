"use client"

import { ReactNode } from "react"

interface TableContentProps {
  children: ReactNode
}

export default function TableContent ({
  children
}: TableContentProps) {
  return (
    <table
      className="w-full"
    >
      { children }
    </table>
  )
}