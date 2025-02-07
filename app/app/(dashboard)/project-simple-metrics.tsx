'use client'
import { SimpleMetricCard } from "@/components/simple-metric-card";
import { cn } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProjectSimpleMetrics ({ projects = [] }) {
  const [planCount, setPlanCount] = useState([
    {plan: 'Free', count: '0', percentage: '0'}, 
    {plan: 'Pro', count: '0', percentage: '0'}, 
    {plan: 'Premium', count: '0', percentage: '0'}
  ]);
  const [allProjectCount, setAllProjectCount] = useState<number>(0)

  useEffect(() => {
    const accountWithTemplateId = 1425
    const projectWithAdvancedPanels = 1499
    const projectWithBasicPanels = 1500

    const validProjects = projects
      .filter(({ linkstoBe, user_id, id }) => 
        !linkstoBe.includes("temanovo_") &&
        !linkstoBe.includes("tema_") &&
        !linkstoBe.includes("modelos_linkstobe") &&
        !linkstoBe.includes("basic_buttons") &&
        !linkstoBe.includes("custom_panel") &&
        user_id !== accountWithTemplateId &&
        id !== projectWithAdvancedPanels &&
        id !== projectWithBasicPanels &&
        id !== 1495
      )

    const totalProjects = validProjects.length;
    const roleCounts = validProjects.reduce((acc, project) => {
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


    setAllProjectCount(validProjects.length)
    if (roleCounts.length) setPlanCount(roleCounts);
  }, [projects]);


  return (

    <div
      className="flex flex-col gap-4"
    >
      <div
        className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
      >
        <SimpleMetricCard.Root
          className={allProjectCount !== 0 ? "bg-cyan-900" : "bg-cyan-900 animate-pulse"}
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

          {
            allProjectCount !== 0 && <SimpleMetricCard.Icon
            icon={Crown}
            className="bg-cyan-800"
          />      }
        </SimpleMetricCard.Root>
      </div>
      <div
        className="flex flex-col sm:grid sm:grid-cols-3 gap-2"
      >
        {
          planCount.map(({ plan, count, percentage }, index) => (
            <SimpleMetricCard.Root
              className={count === "" ? "animate-pulse" : ""}
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