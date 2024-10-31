import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SimpleMetricCardIconProps {
  icon: LucideIcon
  className?: string
}

export default function SimpleMetricCardIcon ({
  icon: Icon,
  className
}: SimpleMetricCardIconProps) {
  return (
    <span
      className={cn("p-3 rounded-lg", className)}
    >
      { 
        <Icon 
          color="white"
        /> 
      }
    </span>
  )
}