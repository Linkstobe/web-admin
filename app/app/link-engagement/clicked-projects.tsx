'use client'
import CalendarDateRangePicker from "@/components/date-ranger-picker"
import { MetricsBarChart } from "@/components/metrics-bar-chart"
import { catchError, formatDateToSequelize } from "@/lib/utils"
import { ProjectService } from "@/services/project.service"
import { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"

type ClickedProjectMetric = {
  name: string
  acessos: number
}

export default function ClickedProjects() {
  const [clickedProjectMetrics, setClickedProjectMetrics] = useState<ClickedProjectMetric[]>(undefined)
    const [date, setDate] = useState<DateRange>({
      from: undefined,
      to: undefined
    });
  
    const changingDate = (event) => {
      setDate(event)
      setClickedProjectMetrics(undefined)
      getProjectCreationMetrics({ startDate: formatDateToSequelize(event.from), endDate: formatDateToSequelize(event.to)})
    }

    const getProjectCreationMetrics = async (dates?: { startDate?: string, endDate?: string }) => {
      const [err, metrics] = await catchError(ProjectService.findClickedProjectMetrics(dates));
      if (err) console.error(err);
      setClickedProjectMetrics(metrics);
    }

    useEffect(() => {
      getProjectCreationMetrics()
    }, [])
    
  return (
    <div
      className={!clickedProjectMetrics ? "animate-pulse bg-slate-200 min-h-[570px] rounded-lg" : "flex flex-col gap-7 border bg-white p-4 rounded-lg shadow-lg"}
    >
      {clickedProjectMetrics && 
      <div>
                <CalendarDateRangePicker
                  className="justify-end"
                  date={date} 
                  setDate={changingDate}
                />
        <MetricsBarChart 
          label="acessos"
          metrics={clickedProjectMetrics}
        /> 
      </div>}
    </div>
  )
}