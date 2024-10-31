'use client'

import { Slash, Store } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useStore } from "@/hook/use-store"
import { useSidebarToggle } from "@/hook/use-sidebar-toggle"
import SheetMenu from "@/components/sheet-menu"

export default function Header () {
  const pathname = usePathname()
  const [onScroll, setOnScroll] = useState(false)

  const sidebar = useStore(useSidebarToggle, (state) => state)

  const handleScroll = () => {
    setOnScroll(window.scrollY >= 20)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!sidebar) return null
  
  const pathSegments = pathname.split("/").filter(item => item)
  let accumulatedPath = ""

  return (
    <header
      className={cn(
        "bg-[#F1F2F3] rounded-xl sticky top-4 p-2 transition-all duration-300 flex items-center",
        onScroll ? 'h-full w-full bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-85 border border-gray-100' : ''
      )}
    >
      <nav
        className="flex items-center gap-4"
      >
        <SheetMenu />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Store size={18} />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            {
              pathSegments.map((segment, index) => {
                accumulatedPath += `/${segment}`
                return (
                  <div 
                    key={index} 
                    className="flex items-center gap-2"
                  >
                    <BreadcrumbItem>
                      <BreadcrumbLink 
                        href={accumulatedPath}
                      >
                        { segment }
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {
                      index < pathSegments.length - 1 && (
                        <BreadcrumbSeparator>
                          <Slash />
                        </BreadcrumbSeparator>
                      )
                    }
                  </div>
                )
              })
            }
          </BreadcrumbList>
        </Breadcrumb>
      </nav>


    </header>
  )
}
