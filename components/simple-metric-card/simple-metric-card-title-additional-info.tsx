import { cn } from "@/lib/utils"

interface SimpleMetricCardTitleAdditionalInfoProps {
  text: string
  className?: string
}

export default function SimpleMetricCardTitleAdditionalInfo ({ 
  text,
  className
}: SimpleMetricCardTitleAdditionalInfoProps) {
  return (
    <span
      className={cn("font-semibold text-zinc-700", className)}
    >
      { text }
    </span>
  )
}