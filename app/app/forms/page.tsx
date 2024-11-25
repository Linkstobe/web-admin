import FormMetricsCards from "./form-metrics-cards";
import FormMetricsTable from "./form-metrics-table";

export default function Forms () {
  return (
    <div>
      <div
        className="flex flex-col gap-4"
      >
        <h4
          className="text-2xl font-bold tracking-tight text-[#164F62]"
        >
          Métricas de formulários
        </h4>
        <FormMetricsCards />
      </div>
      
      <div>
        <FormMetricsTable />
      </div>
    </div>
  )
}