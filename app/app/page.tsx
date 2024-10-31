import ProjectSimpleMetrics from "./project-simple-metrics";
import UserSimpleMetrics from "./user-simple-metrics";
import ProjectChart from "./project-chart";

export default function Dashboard () {
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
    </div>
  )
}