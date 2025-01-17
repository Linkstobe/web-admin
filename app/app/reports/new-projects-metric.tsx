'use client'
import { AnalyticsSimpleCard } from "@/components/analytics-simple-card";
import { Progress } from "@/components/ui/progress";
import { IProject } from "@/interfaces/IProjects";
import { jwtDecode } from "jwt-decode";
import { Crown, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface NewProjectsMetricProps {
  selectedProject: string | number
  projects: IProject[]
}



interface SubscriptionsDetails {
  value: number
  percentage: number
}

interface NewProjectsSubscriptionsDetails {
  free: SubscriptionsDetails
  pro: SubscriptionsDetails
  premium: SubscriptionsDetails
}

export default function NewProjectsMetric ({
  selectedProject,
  projects
}: NewProjectsMetricProps) {
  const [newProjects, setNewProjects] = useState<number>(0)
  const [subscriptionsPercentage, setSubscriptionPercentage] = useState<NewProjectsSubscriptionsDetails>({
    free: { percentage: 0, value: 0 },
    pro: { percentage: 0, value: 0 },
    premium: { percentage: 0, value: 0 },
  })

  useEffect(() => {
    const getAllNewProjects = async () => {
      try {
        const newProjectsCount =
          selectedProject === null
            ? projects.filter(({ referral_id }) => Number(referral_id))
            : projects.filter(({ referral_id }) => Number(referral_id) === Number(selectedProject));

        const totalProjects = newProjectsCount.length;

        const getRole = (project: any) => {
          try {
            //@ts-ignore
            return jwtDecode(project.role)?.role || null;
          } catch {
            return null;
          }
        };

        const freeProjects = newProjectsCount.filter((project) => getRole(project) === "basic").length;
        const proProjects = newProjectsCount.filter((project) => getRole(project) === "pro").length;
        const premiumProjects = newProjectsCount.filter((project) => getRole(project) === "premium").length;

        const calculatePercentage = (value: number, total: number) => {
          if (total === 0) return 0.5; 
          const percentage = (value / total) * 100;
          return percentage === 0 ? 0.5 : percentage;
        };

        setNewProjects(totalProjects);

        setSubscriptionPercentage({
          free: {
            value: freeProjects,
            percentage: calculatePercentage(freeProjects, totalProjects),
          },
          pro: {
            value: proProjects,
            percentage: calculatePercentage(proProjects, totalProjects),
          },
          premium: {
            value: premiumProjects,
            percentage: calculatePercentage(premiumProjects, totalProjects),
          },
        });
      } catch (error) {
        console.log("NewProjectsMetric: ", error);
      }
    };

    getAllNewProjects();
  }, [selectedProject, projects]);



  return (
    <AnalyticsSimpleCard.Root>
      <AnalyticsSimpleCard.Content>
        <AnalyticsSimpleCard.TopSection>
          <AnalyticsSimpleCard.Title 
            title="Novos projetos"
          />

          <AnalyticsSimpleCard.Icon
            icon={UserPlus}
          />
        </AnalyticsSimpleCard.TopSection>
        <AnalyticsSimpleCard.BodySection>
          <AnalyticsSimpleCard.Value 
            value={newProjects}
          />
        </AnalyticsSimpleCard.BodySection>
        <AnalyticsSimpleCard.Footer className="mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-4 items-center">
              <div className="bg-[#20B120] p-1 rounded-lg text-white">
                <Crown />
              </div>

              <Progress value={subscriptionsPercentage.free.percentage} indicatorColor="bg-[#20B120]" />

              <span className="font-semibold">{subscriptionsPercentage.free.value}</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#164F62] p-1 rounded-lg text-white">
                <Crown />
              </div>

              <Progress value={subscriptionsPercentage.pro.percentage} indicatorColor="bg-[#164F62]" />

              <span className="font-semibold">{subscriptionsPercentage.pro.value}</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-[#299FC7] p-1 rounded-lg text-white">
                <Crown />
              </div>

              <Progress value={subscriptionsPercentage.premium.percentage} indicatorColor="bg-[#299FC7]" />

              <span className="font-semibold">{subscriptionsPercentage.premium.value}</span>
            </div>
          </div>
        </AnalyticsSimpleCard.Footer>
      </AnalyticsSimpleCard.Content>
    </AnalyticsSimpleCard.Root>
  )
}