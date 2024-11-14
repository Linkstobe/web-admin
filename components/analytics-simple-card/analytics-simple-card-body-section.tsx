import { HTMLAttributes, ReactNode } from "react"

interface AnalyticsSimpleBodySectionProps extends HTMLAttributes<HTMLDivElement>{
  children: ReactNode
}

export default function AnalyticsSimpleBodySection ({
  children
}: AnalyticsSimpleBodySectionProps) {
  return (
    <div>
      { children }
    </div>
  )
}