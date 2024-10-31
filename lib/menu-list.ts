import { 
  ChartNoAxesCombined, 
  Crown, 
  LayoutDashboard, 
  LucideIcon, 
  PanelTop, 
  Server, 
  TicketSlash, 
  User, 
  UserPlus
} from "lucide-react"

type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
  subMenus: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu []
}

export function handleGetMenuList(pathname: string): Group[] {  
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: "/app",
          label: "Dashboard",
          active: pathname === "/app",
          icon: LayoutDashboard,
          subMenus: []
        }
      ]
    },
    {
      groupLabel: '',
      menus: [
        {
          href: "/app/users",
          label: "Usuários",
          active: pathname.includes("/users"),
          icon: User,
          subMenus: []
        },
      ]
    },
    {
      groupLabel: '',
      menus: [
        {
          href: "/app/links",
          label: "Engajamento - Links",
          active: pathname.includes("/links"),
          icon: ChartNoAxesCombined,
          subMenus: []
        },
      ]
    },
    {
      groupLabel: 'Assinaturas',
      menus: [
        {
          href: "/app/plans",
          label: "Planos",
          active: pathname.includes("/plans"),
          icon: Crown,
          subMenus: []
        },
        {
          href: "/app/coupons",
          label: "Cupons",
          active: pathname.includes("/coupons"),
          icon: TicketSlash,
          subMenus: []
        },
      ]
    },
    {
      groupLabel: 'Biblioteca',
      menus: [
        {
          href: "/app/templates",
          label: "Templates",
          active: pathname.includes("/templates"),
          icon: PanelTop,
          subMenus: []
        },
        {
          href: "/app/buttons",
          label: "Botões",
          active: pathname.includes("/buttons"),
          icon: Server,
          subMenus: []
        },
      ]
    },
    {
      groupLabel: 'Administrador',
      menus: [
        {
          href: "/app/admin-users",
          label: "Usuários Admin",
          active: pathname.includes("/app/admin-users"),
          icon: UserPlus,
          subMenus: []
        },
      ]
    },
  ]
}