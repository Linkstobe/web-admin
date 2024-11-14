import { LucideIcon } from "lucide-react"

interface AnalyticsSimpleCardIconProps {
  icon: LucideIcon
}

export default function AnalyticsSimpleCardIcon ({
  icon: Icon
}: AnalyticsSimpleCardIconProps) {
  return (
    <div
      className="bg-blue-500 p-1 rounded-full"
    >
      <Icon 
        color="#ffffff"
        size={20}
      />
    </div>
  )
}