'use client'
import ProjectSimpleMetrics from "./project-simple-metrics";
import UserSimpleMetrics from "./user-simple-metrics";
import ProjectChart from "./project-chart";
import PanelMetricsTable from "./panel-metrics";
import { TransactionService } from "@/services/transactions.service";
import { Separator } from "@/components/ui/separator";
import { ProjectService } from "@/services/project.service";
import { catchError } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";

export default function Dashboard () {
  const [dashboard, dashboardSet] = useState({
    projects: [],
    usersAmount: 0,
    transactions: []
  });  
  useEffect(() => {
    (async () => {
      const [projectsError, projects] = await catchError(ProjectService.getAllProject());
      if (projectsError) throw projectsError;
      dashboardSet(prev => ({ ...prev, projects }));
      const [usersError, usersAmount] = await catchError(UserService.getAmount());
      if (usersError) throw usersError;
      dashboardSet(prev => ({ ...prev, usersAmount }));
      const [transactionsError, transactions] = await catchError(TransactionService.onGetAllTransactions());
      if (transactionsError) throw transactionsError;
      dashboardSet(prev => ({ ...prev, transactions }));
    })()
  }, [])

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
        <UserSimpleMetrics userAmount={dashboard.usersAmount} />
      </div>

      <div
        className="flex flex-col p-2 rounded-lg gap-4"
      >
        <h3
          className="text-xl font-bold"
        >
          Projetos
        </h3>

        <ProjectSimpleMetrics projects={dashboard.projects}  />
        <ProjectChart projects={dashboard.projects} transactions={dashboard.transactions} />
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

      <h1 className="text-2xl font-bold tracking-tight text-[#164F62]">
        Métricas de painéis
      </h1>
      <div
        className="flex flex-col gap-4"
      >
        <Separator />
        <PanelMetricsTable />
      </div> 
    </div>
  )
}