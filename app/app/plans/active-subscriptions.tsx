"use client"

import PieChart from "@/components/pie-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectService } from "@/services/project.service";
import { jwtDecode } from "jwt-decode";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActiveSubscription () {
  const [planCount, setPlanCount] = useState([])

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const projects = await ProjectService.getAllProject();

        const roleCounts = projects.reduce((acc, project) => {
          const decodedToken = project?.role ? jwtDecode(project.role) : {};
          const plan = decodedToken?.role && decodedToken.role.toLowerCase() !== "basic" 
            ? decodedToken.role.toLowerCase() 
            : "free";

          const existingRole = acc.find(item => item.plan === plan);

          if (existingRole) {
            existingRole.count++;
          } else {
            acc.push({ plan, count: 1 });
          }

          return acc;
        }, [])
        .sort((a, b) => {
          const order = { free: 1, pro: 2, premium: 3 };
          return order[a.plan] - order[b.plan];
        });

        setPlanCount(roleCounts)
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    getAllProjects();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle
          className="flex justify-between items-center"
        >
          Assinaturas ativas

          <Filter
            className="cursor-pointer"
          />
        </CardTitle>
        <CardDescription>
          Número de usuários e seus planos ativos
        </CardDescription>
      </CardHeader>

      <CardContent>
        <PieChart 
          planCount={planCount}
        />
      </CardContent>
    </Card>
  )
}