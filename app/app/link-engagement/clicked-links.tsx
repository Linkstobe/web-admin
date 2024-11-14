import { MetricsBarChart } from "@/components/metrics-bar-chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ClickedLinks () {
  return (
    <div
      className="flex flex-col gap-7 border bg-white p-4 rounded-lg shadow-lg"
    >
      <div
        className="flex justify-between items-center"
      >
        <p
          className="text-[#0E0E0E] font-semibold text-base"
        >
          Links Clicados
        </p>

        <ToggleGroup
          type="single"
          variant="outline"
          className="gap-0 w-72"
        >
          <ToggleGroupItem
            value="Dia"
            className="flex-1 text-[#343434] text-sm rounded-r-none data-[state=on]:bg-[#ECECEC]"
          >
            Dia
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Semana"
            className="flex-1 text-[#343434] text-sm rounded-none data-[state=on]:bg-[#ECECEC]"
          >
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Mês"
            className="flex-1 text-[#343434] text-sm rounded-none data-[state=on]:bg-[#ECECEC]"
          >
            Mês
          </ToggleGroupItem>
          <ToggleGroupItem
            value="Ano"
            className="flex-1 text-[#343434] text-sm rounded-l-none data-[state=on]:bg-[#ECECEC]"
          >
            Ano
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div>
        <MetricsBarChart />
      </div>
    </div>
  )
}