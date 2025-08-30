import Grid, { IconProps } from "@/icons/Dashboard";
import { FaSailboat } from "react-icons/fa6";
import Settings from "@/icons/Settings";
import { IoMdLogOut } from "react-icons/io";
import { RiBloggerLine } from "react-icons/ri";
import { IoIosPricetags } from "react-icons/io";


export interface MenuItem {
  id: string;
  title: string;
  link?: string;
  icon?: React.FC<IconProps>;
}

export interface SidebarMenu {
  menuItems: MenuItem[];
}

export const AdminMenus: SidebarMenu[] = [
  {
    menuItems: [
      {
        id: "dashboard",
        title: "Dashboard",
        link: "/dashboard",
        icon: Grid,
      },
      {
        id: "tags",
        title: "Tags",
        link: "/tags",
        icon: IoIosPricetags,
      },
      {
        id: "yachts",
        title: "Yachts",
        link: "/yachts",
        icon: FaSailboat,
      },
      {
        id: "blog",
        title: "Blog",
        link: "/blog",
        icon: RiBloggerLine,
      },
      {
        id: "settings",
        title: "Settings",
        link: "/settings",
        icon: Settings,
      },
      {
        id: "logout",
        title: "Logout",
        link: "/",
        icon: IoMdLogOut,
      },
    ],
  },
];