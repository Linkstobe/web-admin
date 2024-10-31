import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface SimpleMetricCardRootProps {
  children: ReactNode
  className?: string
}

export default function SimpleMetricCardRoot ({ 
  children,
  className
}: SimpleMetricCardRootProps) {
  return (
    <div
      className={cn("flex items-center justify-between p-2 rounded-lg bg-white shadow-md", className)}
    >
      { children }
    </div>
  )
}