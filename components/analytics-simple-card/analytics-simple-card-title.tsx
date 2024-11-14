interface AnalyticsSimpleCardTitleProps {
  title: string
}

export default function AnalyticsSimpleCardTitle ({
  title
}: AnalyticsSimpleCardTitleProps) {
  return (
    <p
      className="font-medium text-[#164F62]"
    >
      { title }
    </p>
  )
}