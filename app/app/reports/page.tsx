import { Separator } from "@/components/ui/separator";
import AccessesByCountry from "./accesses-by-country";
import AccessesByOperatingSystem from "./accesses-by-operating-system";
import AccessesByState from "./accesses-by-state";
import AccessesPerDay from "./accesses-per-day";
import AccessesPerHour from "./accesses-per-hour";
import AccessesToSocialMedia from "./accesses-to-social-media";
import ProjectsMetricsCards from "../(dashboard)/projects-metrics-cards";

export default function Reports () {
  return (
    <div
      className="flex flex-col gap-4"
    >
      <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de projetos
        </h4>
        <ProjectsMetricsCards />
      </div>

      <AccessesPerDay />
      <AccessesPerHour />

      <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByOperatingSystem />
        <AccessesToSocialMedia />
      </div>

      <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByState />

        <AccessesByCountry />
      </div>
    </div>
  )
}