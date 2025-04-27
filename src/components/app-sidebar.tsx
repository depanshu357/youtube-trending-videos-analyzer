"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Globe, Home, LineChart, Network, PieChart, Cloud, Menu, Sparkles } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
    color: "text-sky-500",
  },
  // {
  //   label: "Trending Over Time",
  //   icon: LineChart,
  //   href: "/line-chart",
  //   color: "text-violet-500",
  // },
  // {
  //   label: "Country Heat Map",
  //   icon: PieChart,
  //   href: "/heat-map",
  //   color: "text-pink-700",
  // },
  // {
  //   label: "Global Trends",
  //   icon: Globe,
  //   href: "/world-map",
  //   color: "text-orange-500",
  // },
  {
    label: "Country Stats",
    icon: BarChart3,
    href: "/bar-chart",
    color: "text-emerald-500",
  },
  {
    label: "Engagement Matrix",
    icon: Network,
    href: "/correlation",
    color: "text-green-700",
  },
  {
    label: "Category Radar",
    icon: PieChart,
    href: "/radar",
    color: "text-blue-600",
  },
  {
    label: "Tag Word Cloud",
    icon: Cloud,
    href: "/word-cloud",
    color: "text-yellow-500",
  },
  {
    label: "Engagement Predictor",
    icon: Sparkles,
    href: "/prediction",
    color: "text-purple-500",
  },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, isMobile, openMobile, setOpenMobile } = useSidebar()

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sidebar className="p-1 bg-gray-50">
        <SidebarHeader className="border-b pb-2">
          <div className="flex items-center pl-2">
            <h1 className="text-xl font-bold px-4">YouTube Trends</h1>
            {/* <SidebarTrigger className="ml-auto" /> */}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === route.href}
                  className="cursor-pointer px-2 my-1"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Link href={route.href}>
                    <route.icon className={cn("mr-2 h-5 w-5", route.color)} />
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  )
}
