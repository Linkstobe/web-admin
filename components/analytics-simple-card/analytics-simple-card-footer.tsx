import { HTMLAttributes } from "react";

interface AnalyticsSimpleCardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export default function AnalyticsSimpleCardFooter ({
  children,
  ...rest
}: AnalyticsSimpleCardFooterProps) {
  return (
    <div {...rest}>
      {children}
    </div>
  )
}