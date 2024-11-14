import { HTMLAttributes, ReactNode } from "react";

interface AnalyticsSimpleCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function AnalyticsSimpleCardContent ({
  children
}: AnalyticsSimpleCardContentProps) {
  return (
    <div className="relative p-1">
      { children }

      <div
        className="h-full w-1 bg-blue-500 rounded-lg top-0 -left-2 absolute"
      ></div>
    </div>
  )
}