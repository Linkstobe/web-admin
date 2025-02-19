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

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  id?: number;
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  subMenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

function groupMenus(data: any[], pathname: string): Group[] {
  const groupedData = data.reduce((acc, item) => {
    const groupLabel = item.group_label || "";
    if (!acc[groupLabel]) {
      acc[groupLabel] = [];
    }
    acc[groupLabel].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  return Object.keys(groupedData).map((groupLabel) => {
    const menus: Menu[] = groupedData[groupLabel].map((item) => ({
      id: item.id,
      href: item.href,
      label: item.label,
      active: pathname.includes(item.href),
      subMenus: [],
    }));

    return {
      groupLabel,
      menus,
    };
  });
}

export function handleGetMenuList(data: any[], pathname: string): Group[] {
  return groupMenus(data, pathname) ?? [];
}
