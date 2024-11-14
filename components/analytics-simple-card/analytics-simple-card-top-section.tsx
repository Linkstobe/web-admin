import { HTMLAttributes } from "react";

interface AnalyticsSimpleCardTopSectionProps extends HTMLAttributes<HTMLDivElement> {}

export default function AnalyticsSimpleCardTopSection ({
  children
}: AnalyticsSimpleCardTopSectionProps) {
  return (
    <div
      className="flex justify-between items-center"
    >
      { children }
    </div>
  )
}