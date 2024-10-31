import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SimpleMetricCardTitleProps {
  title: string
  className?: string
  children?: ReactNode
}

export default  function SimpleMetricCardTitle ({
  title,
  className,
  children
}: SimpleMetricCardTitleProps) {
  return (
    <span
      className={cn("text-zinc-700 text-sm", className)}
    >
      { title } {" "}
      { children }
    </span>
  )
}