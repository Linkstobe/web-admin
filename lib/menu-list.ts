import {
  BanknoteIcon,
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
  Settings,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  subMenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function handleGetMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/app",
          label: "Dashboard",
          active: pathname === "/app",
          icon: LayoutDashboard,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Clientes",
      menus: [
        {
          href: "/app/users",
          label: "Usuários",
          active: pathname.includes("/users"),
          icon: User,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Métricas",
      menus: [
        {
          href: "/app/link-engagement",
          label: "Engajamento - Links",
          active: pathname.includes("/link-engagement"),
          icon: ChartNoAxesCombined,
          subMenus: [],
        },
        {
          href: "/app/panels",
          label: "Engajamento - Painéis",
          active: pathname.includes("/app/panels/"),
          icon: Server,
          subMenus: [],
        },
        {
          href: "/app/reports",
          label: "Relatórios",
          active: pathname.includes("/app/reports"),
          icon: FileTextIcon,
          subMenus: [],
        },
        {
          href: "/app/forms",
          label: "Formulários",
          active: pathname.includes("/app/forms"),
          icon: ClipboardList,
          subMenus: [],
        },
        {
          href: "/app/products",
          label: "Produtos",
          active: pathname.includes("/app/products"),
          icon: ShoppingCart,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Assinaturas",
      menus: [
        {
          href: "/app/plans",
          label: "Planos",
          active: pathname.includes("/plans"),
          icon: Crown,
          subMenus: [],
        },
        {
          href: "/app/coupons",
          label: "Cupons",
          active: pathname.includes("/coupons"),
          icon: TicketSlash,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Biblioteca",
      menus: [
        {
          href: "/app/templates-library",
          label: "Templates",
          active: pathname.includes("/app/templates-library"),
          icon: PanelTop,
          subMenus: [],
        },
        {
          href: "/app/panels-library",
          label: "Painéis",
          active: pathname.includes("/app/panels-library"),
          icon: Server,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Denúncias",
      menus: [
        {
          href: "/app/reported-projects",
          label: "Projetos Denunciados",
          active: pathname.includes("/app/reported-projects"),
          icon: TriangleAlert,
          subMenus: [],
        },
        {
          href: "/app/locks",
          label: "Bloqueios",
          active: pathname.includes("/app/locks"),
          icon: Lock,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Administrador",
      menus: [
        {
          href: "/app/admin-users",
          label: "Usuários Admin",
          active: pathname.includes("/app/admin-users"),
          icon: UserPlus,
          subMenus: [],
        },
        {
          href: "/app/withdraw-analysis",
          label: "Análise de Saque",
          active: pathname.includes("/app/withdraw-analysis"),
          icon: BanknoteIcon,
          subMenus: [],
        },
        {
          href: "/app/commission-config",
          label: "Configurar Comissões",
          active: pathname.includes("/app/commission-config"),
          icon: Settings,
          subMenus: [],
        },
      ],
    },
    {
      groupLabel: "Suporte",
      menus: [
        {
          href: "/app/tutorials",
          label: "Tutoriais",
          active: pathname.includes("/app/tutorials"),
          icon: MonitorPlay,
          subMenus: [],
        },
      ],
    },
  ];
}
