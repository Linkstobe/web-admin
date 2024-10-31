'use client'

import SimpleLineChart from "@/components/simple-line-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectService } from "@/services/project.service";
import { TransactionService } from "@/services/transactions.service";
import { jwtDecode } from "jwt-decode";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface SubscriptionConversionProps {
  chartClassName?: string
  chartContainerClassName?: string
  className?: string
}

export default function SubscriptionConversion ({
  chartClassName,
  chartContainerClassName,
  className
}: SubscriptionConversionProps) {
  const [monthlySubscriptions, setMonthlySubscriptions] = useState([]);

  useEffect(() => {
    const getAllTransactions = async () => {
      const projects = await ProjectService.getAllProject();
      const transactions = await TransactionService.onGetAllTransactions();

      const months = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString("default", { month: "long" }),
        basic: 0,
        pro: 0,
        premium: 0,
      }));

      const planSubscriptions = transactions.filter(transaction => transaction.type === "plan");
      const freeSubscriptions = projects.filter(project => jwtDecode(project.role)?.role === "basic");
      const proPlanSubscriptions = planSubscriptions.filter(transaction => transaction.amount === "1499" || transaction.amount === "14390");
      const premiumPlanSubscriptions = planSubscriptions.filter(transaction => transaction.amount === "4999" || transaction.amount === "47990");

      console.log({ freeSubscriptions });
      

      const incrementMonth = (date, planType) => {
        const monthIndex = new Date(date).getMonth();
        if (months[monthIndex]) {
          months[monthIndex][planType] += 1;
        }
      };

      freeSubscriptions.forEach(subscription => incrementMonth(subscription.createdAt, "basic"));

      proPlanSubscriptions.forEach(subscription => incrementMonth(subscription.createdAt, "pro"));

      premiumPlanSubscriptions.forEach(subscription => incrementMonth(subscription.createdAt, "premium"));

      setMonthlySubscriptions(months);
    };

    getAllTransactions();
  }, []);

  useEffect(() => {
    console.log({ monthlySubscriptions });
  }, [monthlySubscriptions])

  return (
    <Card
      className={className}
    >
      <CardHeader>
        <CardTitle
          className="flex justify-between items-center"
        >
          Conversão de assinaturas

          <Filter
            className="cursor-pointer"
          />
        </CardTitle>
        <CardDescription>
          Gráfico de conversão de assinaturas
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SimpleLineChart 
          data={monthlySubscriptions}
          // containerClassName="max-w-[400px] w-full 2xl:max-w-[500px] bg-red-800"
          // chartClassName=" h-[400px] bg-violet-700 w-full"
          chartClassName={chartClassName}
          containerClassName={chartContainerClassName}
        />
      </CardContent>
    </Card>
  )
}