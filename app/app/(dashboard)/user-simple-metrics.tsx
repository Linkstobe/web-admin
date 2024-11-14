'use client'

import { SimpleMetricCard } from "@/components/simple-metric-card";
import { UserService } from "@/services/user.service";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserSimpleMetrics () {
  const [usersCount, setUsersCount] = useState<number>(0)

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const users = await UserService.getAllUsers()
        setUsersCount(users.length)
      } catch (error) {
        console.log(error);
      }
    }

    getAllUsers()
  }, [])

  return (
    <div
      className="sm:grid sm:grid-cols-3 gap-2"
    >
      <SimpleMetricCard.Root
        className="bg-cyan-900"
      >
        <SimpleMetricCard.TextSection>
          <SimpleMetricCard.Title
            title="Total de usuários"
            className="text-white"
          />
          <SimpleMetricCard.Value 
            value={`${usersCount}`}
            className="text-white"
          />
        </SimpleMetricCard.TextSection>

        <SimpleMetricCard.Icon
          icon={Users}
          className="bg-cyan-800"
        />
      </SimpleMetricCard.Root>
    </div>
  )
}