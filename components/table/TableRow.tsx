"use client"

import { HTMLAttributes, ReactNode } from "react"

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode
}

export default function TableRow ({
  children,
  ...rest
}: TableRowProps) {
  return (
    <tr {...rest}>
      { children }
    </tr>
  )
}