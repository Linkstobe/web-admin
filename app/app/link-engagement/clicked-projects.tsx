'use client'
import { MetricsBarChart } from "@/components/metrics-bar-chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IMetric } from "@/interfaces/IMetrics"
import { IProject } from "@/interfaces/IProjects"
import { useEffect, useState } from "react"

interface ClickedProjectsProps {
  projects: IProject[]
  projectAccessMetrics: IMetric[]
}

type ClickedProjectMetric = {
  name: string
  acessos: number
}

type PeriodInDays ={
  name: string
  days: number
}

export default function ClickedProjects ({
  projects,
  projectAccessMetrics
}: ClickedProjectsProps) {
  const [clickedProjectMetrics, setClickedProjectMetrics] = useState<ClickedProjectMetric[]>([])
  const [allMetrics, setAllMetrics] = useState<IMetric[]>(projectAccessMetrics)
  const [allProjects, setAllProjects] = useState<IProject[]>(projects)
  const [periodInDays, setPeriodInDays] = useState<PeriodInDays>({
    days: 30,
    name: "Mês"
  })
  
  const handlePeriodChange = (value: string) => {
    switch (value) {
      case "Dia":
        setPeriodInDays({ days: 1, name: "Dia" });
        break;
      case "Semana":
        setPeriodInDays({ days: 7, name: "Semana" });
        break;
      case "Mês":
        setPeriodInDays({ days: 30, name: "Mês" });
        break;
      case "Ano":
        setPeriodInDays({ days: 365, name: "Ano" });
        break;
      default:
        // Não altera o estado se o valor for inválido
        break;
    }
  };

  useEffect(() => {
    const fetchMetricsAndProjects = () => {
      setAllMetrics(projectAccessMetrics)
      setAllProjects(projects)
    }

    fetchMetricsAndProjects()
  }, [])

  useEffect(() => {
    if (!allMetrics || !allProjects || !periodInDays || !projectAccessMetrics) return;

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - periodInDays.days);


    const filteredMetrics = projectAccessMetrics.filter(({ createdAt }) => {
      const metricDate = new Date(createdAt);
      return metricDate >= startDate && metricDate <= now;
    });

    const projectMetrics: ClickedProjectMetric[] = projects
      .map(({ id, linkstoBe }) => {
        console.log()
        const metricCount = filteredMetrics.filter(({ user_id }) => user_id === id).length;

        return { name: linkstoBe, acessos: metricCount };
      })
      .sort((a, b) => b.acessos - a.acessos)
      .slice(0, 10);

    
    setClickedProjectMetrics(projectMetrics);
  }, [allMetrics, allProjects, periodInDays, projects, projectAccessMetrics]);

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
          Projetos Acessados
        </p>

        <ToggleGroup
          type="single"
          variant="outline"
          className="gap-0 w-72"
          onValueChange={handlePeriodChange}
          value={periodInDays.name}
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
        <MetricsBarChart 
          label="acessos"
          metrics={clickedProjectMetrics}
        />
      </div>
    </div>
  )
}