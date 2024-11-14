import MetricsRadarChart from "@/components/metrics-radar-chart";
import { Ellipsis } from "lucide-react";

export default function EngagementFunnel () {
  return (
    <div
      className="flex h-full flex-col gap-4 border bg-white rounded-lg shadow-lg"
    >
      <div
        className="flex justify-between items-center p-4"
      >
        <p
          className="text-[#0E0E0E] font-semibold text-base"
        >
          Funil de engajamento
        </p>
        
        <Ellipsis />
      </div>

      <div
        className="p-4 h-full flex justify-center items-center"
      >
        <MetricsRadarChart />
      </div>
    </div>
  )
}