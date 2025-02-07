'use client'
import SimpleLineChart from "@/components/simple-line-chart";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function ProjectChart ({ projects = [], transactions = [] }) {
  const [monthlySubscriptions, setMonthlySubscriptions] = useState([]);

  useEffect(() => {
      const getAllTransactions = async () => {
        const months = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(0, i).toLocaleString("default", { month: "long" }),
          basic: 0,
          pro: 0,
          premium: 0,
        }));
  
        const planSubscriptions = transactions.filter(transaction => transaction.type === "plan");
        // @ts-ignore
        const freeSubscriptions = projects.filter(project => jwtDecode(project.role)?.role === "basic");
        const proPlanSubscriptions = planSubscriptions.filter(transaction => transaction.amount === "1499" || transaction.amount === "14390");
        const premiumPlanSubscriptions = planSubscriptions.filter(transaction => transaction.amount === "4999" || transaction.amount === "47990");
  
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
  }, [projects, transactions]);

  return (
    <SimpleLineChart 
      data={monthlySubscriptions}
      chartClassName="h-[400px]"
    />
  )
}