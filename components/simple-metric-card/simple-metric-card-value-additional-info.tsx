import { cn } from "@/lib/utils"

interface SimpleMetricCardAdditionalInfoProps {
  text: string
  className?: string
}

export default function SimpleMetricCardValueAdditionalInfo ({ 
  text,
  className
}: SimpleMetricCardAdditionalInfoProps) {
  return (
    <span
      className={cn("text-xl text-zinc-400", className)}
    >
      { text }
    </span>
  )
}