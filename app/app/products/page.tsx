import { Separator } from "@/components/ui/separator";
import ProductsMetricsCards from "./products-metrics-cards";
import ProductMetricsTable from "./products-metrics-table";

export default function Products () {
  return (
    <div>
      <div
        className="flex flex-col gap-4"
      >
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
    </div>
  )
}