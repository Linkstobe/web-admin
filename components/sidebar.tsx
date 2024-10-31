'use client'

import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/menu";
import { SidebarToggle } from "./sidebar-toggle";
import { useSidebarToggle } from "@/hook/use-sidebar-toggle";
import { useStore } from "@/hook/use-store";
import { cn } from "@/lib/utils";

export default function Sidebar () {
  const sidebar = useStore(useSidebarToggle, (state) => state)

  if(!sidebar) return null

  return (
    <aside
      className={cn(
        "hidden lg:block p-4 fixed h-full transition-all duration-700",
        sidebar?.isOpen ? 'w-[20rem]' : 'w-[130px]'
      )}
    >
      <div
        className="bg-white rounded-lg w-full h-full overflow-auto p-4"
      >
        <div
          className="flex p-2 pb-5 border-b border-b-zinc-100 cursor-pointer"
        >
          <Link
            href="/dashboard"
          >
            <Image
              src={`/images/${!sidebar?.isOpen ? 'short-' : ''}light-logo.png`}
              width={180}
              height={180}
              quality={100}
              alt="Linksto.be Logo"
              priority
            />

          </Link>
          <SidebarToggle
            isOpen={sidebar?.isOpen} 
            setIsOpen={sidebar?.setIsOpen}
          />
        </div>
        <Menu 
          isOpen={sidebar?.isOpen}
        />
      </div>

    </aside>
  )
}