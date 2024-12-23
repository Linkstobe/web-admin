'use client'

import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IMetric {
  createdAt: string;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

interface LineChartProps {
  accessMetrics: IMetric[];
  clicksMetrics: IMetric[];
  dateRange: DateRange | undefined;
}

export default function LineChart({
  accessMetrics,
  clicksMetrics,
  dateRange,
}: LineChartProps) {
  const [metricsPerDay, setMetricsPerDay] = useState([]);

  useEffect(() => {
    const getAllMetrics = async () => {
      if (!accessMetrics || !clicksMetrics) return;

      const startDate = dateRange?.from || subDays(new Date(), 89);
      const endDate = dateRange?.to || new Date();

      const daysArray = eachDayOfInterval({ start: startDate, end: endDate });

      const metricsByDay = daysArray.map((day) => {
        const dateString = format(day, 'dd/MM', { locale: ptBR });

        const accessCount = accessMetrics.filter(({ createdAt }) =>
          format(new Date(createdAt), 'dd/MM', { locale: ptBR }) === dateString
        ).length;

        const clickCount = clicksMetrics.filter(({ createdAt }) =>
          format(new Date(createdAt), 'dd/MM', { locale: ptBR }) === dateString
        ).length;

        return { name: dateString, acessos: accessCount, cliques: clickCount };
      });

      setMetricsPerDay(metricsByDay);
    };

    getAllMetrics();
  }, [accessMetrics, clicksMetrics, dateRange]);

  const [options, setOptions] = useState({
    title: {
      text: "Métricas de Acessos e Cliques",
    },
    data: metricsPerDay,
    series: [
      {
        type: "line",
        xKey: "name", // Usando o campo `name` como eixo X
        yKey: "acessos", // Série 1: Acessos
        yName: "Acessos",
      },
      {
        type: "line",
        xKey: "name", // Usando o campo `name` como eixo X
        yKey: "cliques", // Série 2: Cliques
        yName: "Cliques",
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Dias' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Quantidade' },
      },
    ],
  });

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      data: metricsPerDay,
    }));
  }, [metricsPerDay]);

  //@ts-ignore
  return <AgCharts options={options} />;
}
