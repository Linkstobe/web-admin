'use client'

import {
  ChartNoAxesCombined,
  ClipboardList,
  Crown,
  FileTextIcon,
  LayoutDashboard,
  Lock,
  LucideIcon,
  MonitorPlay,
  PanelTop,
  Server,
  ShoppingCart,
  TicketSlash,
  TriangleAlert,
  User,
  UserPlus,
} from "lucide-react";

import { Group, handleGetMenuList } from "@/lib/menu-list"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import { Ellipsis, LogOut } from "lucide-react"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui/tooltip'

import { useStore } from "@/hook/use-store"
import { useSidebarToggle } from "@/hook/use-sidebar-toggle"
import { useEffect, useState } from "react"
import { MenusService } from "@/services/menus.service"

interface MenuProps {
  isOpen: boolean | undefined
}

const hrefToIcon = {
  "/app": <LayoutDashboard />,
  "/app/users": <User />,
  "/app/link-engagement": <ChartNoAxesCombined />,
  "/app/panels": <Server />,
  "/app/reports": <FileTextIcon />,
  "/app/forms": <ClipboardList />,
  "/app/products": <ShoppingCart />,
  "/app/plans": <Crown />,
  "/app/coupons": <TicketSlash />,
  "/app/templates-library": <PanelTop />,
  "/app/panels-library": <Server />,
  "/app/reported-projects": <TriangleAlert />,
  "/app/locks": <Lock />,
  "/app/admin-users": <UserPlus />,
  "/app/tutorials": <MonitorPlay />,
};


export default function Menu ({
  isOpen
}: MenuProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [menus, setMenus] = useState<Group[]>([])
  
    useEffect(() => {
      
      const getAllAccessesMetrics = async () => {
        const menus = JSON.parse(localStorage.getItem('menus')) ? JSON.parse(localStorage.getItem('menus')) : await MenusService.getMenusFromUser(JSON.parse(localStorage.getItem('@linkstobe_user')).id);
        localStorage.setItem('menus', JSON.stringify(menus));
        setMenus(handleGetMenuList(menus, pathname))
      }
  
      getAllAccessesMetrics()
    }, [])

  const sidebar = useStore(useSidebarToggle, (state) => state)

  if(!sidebar) return null


  const onLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "permission=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  }

  return (

    <nav className="mt-8 w-full">
      <div className="w-full flex flex-colitems-start space-y-1 px-2 justify-between">
        <ul className="flex flex-col w-full items-start">
          {menus.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {
                (isOpen && groupLabel) || isOpen === undefined ? (
                  <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                    {groupLabel}
                  </p>
                ) : !isOpen && isOpen !== undefined && groupLabel ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger className="w-full">
                        <div className="w-full flex justify-center items-center">
                          <Ellipsis className="h-5 w-5" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{groupLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <p className="pb-2"></p>
                )}
                {menus.map(
                  ({ href, label, icon: Icon, active, subMenus }, index) =>
                    subMenus.length === 0 ? (
                      <div
                        className="w-full"
                        key={index}
                      >
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={pathname === href && isOpen ? 'secondary' : 'ghost'}
                                className="w-full justify-start h-10 mb-1 p-0 hover:bg-accent"
                                asChild
                              >
                                <Link href={href}>
                                  <span
                                    className={cn(
                                      isOpen ? 'mr-4' : 'ml-0.5',
                                      'p-2 bg-zinc-100 rounded-lg shadow-md',
                                      pathname === href  ? 'bg-cyan-900 text-white' : '',
                                    )}
                                  >
                                    { hrefToIcon[href] }
                                  </span>

                                  {
                                    isOpen &&
                                    <p
                                      className={cn(
                                        !isOpen ? 'ml-4' : '',
                                        'max-w-[200px] truncate translate-x-0 opacity-100 font-medium'
                                      )}
                                    >
                                      {label}
                                    </p>
                                  }

                                </Link>
                              </Button>
                            </TooltipTrigger>
                            
                            {isOpen === false && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={index}>
                        {/* <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={active}
                          submenus={submenus}
                          isOpen={isOpen}
                        /> */}
                      </div>
                    )
                )
              }
            </li>
          ))}

          <li
            className={cn('w-full pt-5')}
          >
            {
              !isOpen 
              ?
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>Ações</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              :
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  Ações
                </p>
            }           

            <div
              className="w-full"
            >
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      className="w-full justify-start h-10 mb-1 p-0 hover:bg-accent"
                      asChild
                      onClick={onLogout}
                    >
                      <Link href="/">
                        <span
                          className={cn(
                            isOpen ? 'mr-4' : 'ml-0.5',
                            'p-2 bg-zinc-100 rounded-lg shadow-md',
                          )}
                        >
                          <LogOut
                            size={20}
                          />
                        </span>

                        {
                          isOpen &&
                          <p
                            className={cn(
                              !isOpen ? 'ml-4' : '',
                              'max-w-[200px] truncate translate-x-0 opacity-100 font-medium'
                            )}
                          >
                            Sair
                          </p>
                        }
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side="right">
                      Sair
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </li>
        </ul>
      </div>
      
    </nav>
  )
}