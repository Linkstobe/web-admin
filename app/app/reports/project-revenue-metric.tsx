'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { Progress } from "@/components/ui/progress";
import { IProject } from "@/interfaces/IProjects";
import { jwtDecode } from "jwt-decode";
import { Crown, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectRevenueMetricProps {
  selectedProject: string | number
  projects: IProject[]
}

interface RevenueDetails {
  revenue: number
  percentage: number
}

interface SubscriptionsRevenueDetails {
  free: RevenueDetails
  pro: RevenueDetails
  premium: RevenueDetails
}

export default function ProjectRevenueMetric ({
  selectedProject,
  projects
}: ProjectRevenueMetricProps) {
  const [revenue, setRevenue] = useState<number>(0)
  const formatedRevenue = revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const [subscriptionsRevenue, setSubscriptionRevenue] = useState<SubscriptionsRevenueDetails>({
    free: { percentage: 0, revenue: 0 },
    pro: { percentage: 0, revenue: 0 },
    premium: { percentage: 0, revenue: 0 },
  })

  useEffect(() => {
    let newProjectsCount = projects.filter(({ referral_id }) => Number(referral_id) === Number(selectedProject))

    if (selectedProject === null) {
      newProjectsCount = projects.filter(({ referral_id }) => Number(referral_id))
    } else {
      newProjectsCount = projects.filter(({ referral_id }) => Number(referral_id) === Number(selectedProject))
    }

    let freeSubscriptions: number = 0

    let proSubscriptions: number = 0
    let proSubscriptionPrice: number = 14.99

    let premiumSubscriptions: number = 0
    let premiumSubscriptionPrice: number = 49.99

    newProjectsCount.forEach((project) => {
      //@ts-ignore
      const role = jwtDecode(project.role)?.role;

      if (role === "basic") {
        freeSubscriptions++;
      } else if (role === "pro") {
        proSubscriptions++;
      } else if (role === "premium") {
        premiumSubscriptions++;
      }
    });

    const totalRevenue = (proSubscriptions * proSubscriptionPrice) + (premiumSubscriptions * premiumSubscriptionPrice)

    const calculatePercentage = (revenue: number, total: number) => {
      if (total === 0) return 0.5;
      const percentage = (revenue / total) * 100;
      return percentage === 0 ? 0.5 : percentage;
    };

    setSubscriptionRevenue({
      free: { 
        revenue: 0, 
        percentage: calculatePercentage(0, totalRevenue)
      },
      pro: {
        revenue: proSubscriptions * proSubscriptionPrice,
        percentage: calculatePercentage(proSubscriptions * proSubscriptionPrice, totalRevenue),
      },
      premium: { 
        revenue: premiumSubscriptions * premiumSubscriptionPrice,
        percentage: calculatePercentage(premiumSubscriptions * premiumSubscriptionPrice, totalRevenue),
      },
    });

    setRevenue(totalRevenue)
  }, [selectedProject])

  return (
    <AnalyticsSimpleCard.Root>
      <AnalyticsSimpleCard.Content>
        <AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.Title 
            title="Faturamento"
          />

          <AnalyticsSimpleCard.Icon
            icon={DollarSign}
          />
        </AnalyticsSimpleCard.TopSection>
        <AnalyticsSimpleCard.BodySection>
          <AnalyticsSimpleCard.Value 
            value={`R$ ${formatedRevenue}`}
          />
        </AnalyticsSimpleCard.BodySection>
        <AnalyticsSimpleCard.Footer className="mt-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <div className="bg-[#20B120] p-1 rounded-lg text-white">
              <Crown />
            </div>

            <Progress value={subscriptionsRevenue.free.percentage} indicatorColor="bg-[#20B120]" />

            <span className="font-semibold whitespace-nowrap">R$ {subscriptionsRevenue.free.revenue}</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#164F62] p-1 rounded-lg text-white">
              <Crown />
            </div>

            <Progress value={subscriptionsRevenue.pro.percentage} indicatorColor="bg-[#164F62]" />

            <span className="font-semibold whitespace-nowrap">R$ {subscriptionsRevenue.pro.revenue}</span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-[#299FC7] p-1 rounded-lg text-white">
              <Crown />
            </div>

            <Progress value={subscriptionsRevenue.premium.percentage} indicatorColor="bg-[#299FC7]" />

            <span className="font-semibold whitespace-nowrap">R$ {subscriptionsRevenue.premium.revenue}</span>
          </div>
        </div>
      </AnalyticsSimpleCard.Footer>
      </AnalyticsSimpleCard.Content>
    </AnalyticsSimpleCard.Root>
  )
}