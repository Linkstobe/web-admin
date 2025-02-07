'use client'

import { SimpleMetricCard } from "@/components/simple-metric-card";
import { Users } from "lucide-react";

export default function UserSimpleMetrics ({ userAmount }) {
  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-2"
    >
      <SimpleMetricCard.Root
        className={userAmount ? "bg-cyan-900" : "bg-cyan-900 animate-pulse"}

      >
        <SimpleMetricCard.TextSection>
          <SimpleMetricCard.Title
            title="Total de usuários"
            className="text-white"
          />
          <SimpleMetricCard.Value 
            value={`${userAmount}`}
            className="text-white"
          />
        </SimpleMetricCard.TextSection>
        <SimpleMetricCard.Icon
          icon={Users}
          className="bg-cyan-800"
        />
      </SimpleMetricCard.Root>
    </div>
  )
}