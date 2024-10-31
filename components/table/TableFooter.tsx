import { ReactNode } from "react"

interface TableFooterProps {
  children: ReactNode
}

export default function TableFooter ({
  children
}: TableFooterProps) {
  return (
    <div
      className="border rounded-b-lg"
    >
      { children }
    </div>
  )
}