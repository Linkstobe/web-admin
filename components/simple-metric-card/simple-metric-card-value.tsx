import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SimpleMetricCardValueProps {
  value: string
  className?: string
  children?: ReactNode
}

export default function SimpleMetricCardValue ({
  value,
  className,
  children
}: SimpleMetricCardValueProps) {
  return (
    <h4
      className={cn("text-3xl font-semibold text-zinc-700", className)}
    >
      { value } {" "}
      { children }
    </h4>
  )
}