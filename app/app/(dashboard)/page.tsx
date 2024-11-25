import ProjectSimpleMetrics from "./project-simple-metrics";
import UserSimpleMetrics from "./user-simple-metrics";
import ProjectChart from "./project-chart";
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { DollarSign, MousePointerClick, Percent, User } from "lucide-react";
import PanelMetricsTable from "./panel-metrics";
import { cookies } from "next/headers";
import { IMetric } from "@/interfaces/IMetrics";
import ProjectsMetricsCards from "./projects-metrics-cards";
import { Separator } from "@/components/ui/separator";

export default async function Dashboard () {
  return (
    <div
      className="flex flex-col gap-4 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div
        className="flex flex-col p-2 rounded-lg gap-4"
      >
        <h3
          className="text-xl font-bold"
        >
          Usuários
        </h3>

        <UserSimpleMetrics />
      </div>

      <div
        className="flex flex-col p-2 rounded-lg gap-4"
      >
        <h3
          className="text-xl font-bold"
        >
          Projetos
        </h3>

        <ProjectSimpleMetrics />
        <ProjectChart />
      </div>

      {/* <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de projetos
        </h4>
        <ProjectsMetricsCards />
      </div> */}

      {/* <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByOperatingSystem />
        <AccessesToSocialMedia />
      </div> */}

      {/* <div
        className="grid grid-cols-2 gap-4 bg-white rounded-lg shadow-lg p-4"
      >
        <AccessesByState />

        <AccessesByCountry />
      </div> */}
      {/* <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de formulários
        </h4>
        <FormMetricsCards />
      </div> */}
      

      {/* <div>
        <FormMetricsTable />
      </div> */}

      {/* <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de produtos
        </h4>
        <ProductsMetricsCards />
      </div>

      <div>
        <ProductMetricsTable />
      </div>
*/}

      <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de painéis
        </h4>
        <PanelMetricsTable />
      </div> 
    </div>
  )
}