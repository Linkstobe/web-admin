import { ReactNode } from "react"

interface SimpleMetricCardTextSectionProps {
  children: ReactNode
}

export default function SimpleMetricCardTextSection ({
  children
}: SimpleMetricCardTextSectionProps) {
  return (
    <div
      className="flex flex-col"
    >
      { children }
    </div>
  )
}