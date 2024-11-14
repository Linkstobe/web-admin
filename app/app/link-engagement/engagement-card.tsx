import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EngagementCardProps {
  title: string
  value: number | string
}

export default function EngagementCard ({
  title,
  value
}: EngagementCardProps) {
  return (
    <Card
      className="border-none rounded-lg"
    >
      <CardHeader
        className="py-4"
      >
        <CardTitle
          className="text-[#0E0E0E] text-base font-semibold"
        >
          { title }
        </CardTitle>
      </CardHeader>
      <CardContent
        className="py-4"
      >
        <p
          className="text-center text-[#164F62] font-extrabold text-[48px]"
        >
          { value }
        </p>
      </CardContent>
    </Card>
  )
}