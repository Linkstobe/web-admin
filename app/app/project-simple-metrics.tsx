'use client'
import { SimpleMetricCard } from "@/components/simple-metric-card";
import { cn } from "@/lib/utils";
import { ProjectService } from "@/services/project.service";
import { jwtDecode } from "jwt-decode";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectSimpleMetrics () {
  const [planCount, setPlanCount] = useState([])
  const [allProjectCount, setAllProjectCount] = useState<number>(0)

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const projects = await ProjectService.getAllProject();

        const totalProjects = projects.length;

        const roleCounts = projects.reduce((acc, project) => {
          const decodedToken = project?.role ? jwtDecode(project.role) : {};
          // @ts-ignore
          const plan = decodedToken?.role && decodedToken.role.toLowerCase() !== "basic" 
          // @ts-ignore
            ? decodedToken.role.toLowerCase() 
            : "free";

          const existingRole = acc.find(item => item.plan === plan);

          if (existingRole) {
            existingRole.count++;
            existingRole.percentage = ((existingRole.count / totalProjects) * 100).toFixed(2);
          } else {
            acc.push({ plan, count: 1, percentage: ((1 / totalProjects) * 100).toFixed(2) });
          }

          return acc;
        }, [])
        .sort((a, b) => {
          const order = { free: 1, pro: 2, premium: 3 };
          return order[a.plan] - order[b.plan];
        });


        setAllProjectCount(projects.length)
        setPlanCount(roleCounts);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    getAllProjects();
  }, []);


  return (

    <div
      className="flex flex-col gap-4"
    >
      <div
        className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
      >
        <SimpleMetricCard.Root
          className="bg-cyan-900"
        >
          <SimpleMetricCard.TextSection>
            <SimpleMetricCard.Title
              title="Total de projetos"
              className="text-white"
            />
            <SimpleMetricCard.Value 
              value={`${allProjectCount}`}
              className="text-white"
            />
          </SimpleMetricCard.TextSection>

          <SimpleMetricCard.Icon
            icon={Crown}
            className="bg-cyan-800"
          />
        </SimpleMetricCard.Root>
      </div>

      <div
        className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
      >
        {
          planCount.map(({ plan, count, percentage }, index) => (
            <SimpleMetricCard.Root
              key={index}
            >
              <SimpleMetricCard.TextSection>
                <SimpleMetricCard.Title 
                  title="Plano"
                >
                  <SimpleMetricCard.TitleAdditionalInfo
                    className="capitalize"
                    text={plan}
                  />
                </SimpleMetricCard.Title>
                <SimpleMetricCard.Value
                  value={count}
                >
                  <SimpleMetricCard.ValueAdditionalInfo 
                    text={`(${percentage}%)`}
                  />
                </SimpleMetricCard.Value>
              </SimpleMetricCard.TextSection>
              <SimpleMetricCard.Icon
                className={
                  cn(
                    plan?.toUpperCase() === "PREMIUM" ? "bg-[#299FC7]"
                    : (plan?.toUpperCase() === "PRO" ? "bg-[#164F62]"
                      : "bg-[#20B120]"
                    )
                  )
                }
                icon={Crown}
              />
            </SimpleMetricCard.Root>
          ))
        }
      </div>
    </div>

  )
}