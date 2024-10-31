'use client'

import Header from "@/components/header";
import { useSidebarToggle } from "@/hook/use-sidebar-toggle";
import { useStore } from "@/hook/use-store";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContentLayoutProps {
  children: ReactNode
}

export default function ContentLayout ({
  children
}: ContentLayoutProps) {
  const sidebar = useStore(useSidebarToggle, (state) => state)

  if(!sidebar) return null

  return (
    <div
      className={cn(
        "grid grid-rows-[60px_1fr] pt-4 px-4 gap-4 transition-all duration-700",
        sidebar?.isOpen ? 'lg:ml-[20rem]' : 'lg:ml-[130px]'
      )}
    >
      <Header />
      { children }
    </div>
  )
}