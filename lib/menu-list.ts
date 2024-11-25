import { 
  ChartNoAxesCombined, 
  ClipboardList, 
  Crown, 
  FileTextIcon, 
  LayoutDashboard, 
  Lock, 
  LucideIcon, 
  PanelTop, 
  Server, 
  ShoppingCart, 
  TicketSlash, 
  TriangleAlert, 
  User, 
  UserPlus,
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
      groupLabel: 'Métricas',
      menus: [
        {
          href: "/app/link-engagement",
          label: "Engajamento - Links",
          active: pathname.includes("/link-engagement"),
          icon: ChartNoAxesCombined,
          subMenus: []
        },
        {
          href: "/app/reports",
          label: "Relatórios",
          active: pathname.includes("/app/reports"),
          icon: FileTextIcon,
          subMenus: []
        },
        {
          href: "/app/forms",
          label: "Formulários",
          active: pathname.includes("/app/forms"),
          icon: ClipboardList,
          subMenus: []
        },
        {
          href: "/app/products",
          label: "Produtos",
          active: pathname.includes("/app/products"),
          icon: ShoppingCart,
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
      groupLabel: 'Denúncias',
      menus: [
        {
          href: "/app/reported-projects",
          label: "Projetos Denunciados",
          active: pathname.includes("/app/reported-projects"),
          icon: TriangleAlert,
          subMenus: []
        },
        {
          href: "/app/locks",
          label: "Bloqueios",
          active: pathname.includes("/app/locks"),
          icon: Lock,
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