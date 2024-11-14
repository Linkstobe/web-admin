import { HTMLAttributes } from "react";

interface AnalyticsSimpleCardRootProps extends HTMLAttributes<HTMLDivElement> {}

export default function AnalyticsSimpleCardRoot ({
  children
}: AnalyticsSimpleCardRootProps) {
  return (
    <div
      className="p-4 shadow-lg border rounded-lg"
    >
      { children }
    </div>
  )
}