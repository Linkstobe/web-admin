interface AnalyticsSimpleCardValueProps {
  value: number | string
  type?: "monetary" | "percent" | "default"
}

export default function AnalyticsSimpleCardValue ({
  value,
  type = "default"
}: AnalyticsSimpleCardValueProps) {
  return (
    <p
      className="text-[#164F62] font-bold text-2xl"
    >
      {
        type === "monetary" &&
        <span
          className="text-sm mr-1"
        >
          R$
        </span>
      }
      { value }
      {
        type === "percent" &&
        <span>
          %
        </span>
      }
    </p>
  )
}