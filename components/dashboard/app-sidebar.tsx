"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"
import {
  // ArrowUpCircleIcon,
  // BarChartIcon,
  // CameraIcon,
  // ClipboardListIcon,
  // DatabaseIcon,
  // FileCodeIcon,
  // FileIcon,
  // FileTextIcon,
  // FolderIcon,
  HelpCircleIcon,
  ImageIcon,
  LayoutDashboardIcon,
  // ListIcon,
  SearchIcon,
  SettingsIcon,
  // UsersIcon,
  Brain,
  Zap,
} from "lucide-react"

// import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarMenu,
  // SidebarMenuButton,
  // SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type Profile } from "@/lib/database"
import { LogoutButton } from "./logout-button"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { LogOutIcon } from "lucide-react"
import { getCreditStatsClient } from "@/lib/credits-client"
import { Badge } from "../ui/badge"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = React.useState<Profile | null>(null)
  const [creditBalance, setCreditBalance] = React.useState<number | null>(null)
  
  React.useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
        
        // Fetch credit stats
        const creditStats = await getCreditStatsClient()
        setCreditBalance(creditStats.balance)
      }
    }
    fetchProfile()
  }, [])

const data = {
  user: {
      name: profile?.full_name ?? 'Guest',
      email: profile?.email ?? '',
      avatar: profile?.avatar_url ?? '',
  },
  navMain: [
    {
      title: "Dashboard",
        url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Generated Images",
      url: "/dashboard/images",
      icon: ImageIcon,
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "/docs-section",
      icon: HelpCircleIcon,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "/docs-section",
      icon: HelpCircleIcon,
    },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: SearchIcon,
    // },
  ],
  }


  return (
    <Sidebar collapsible="offcanvas" className="border-r-0 [&_[data-sidebar='sidebar']]:rounded-xl [&_[data-sidebar='sidebar']]:bg-white/50 [&_[data-sidebar='sidebar']]:dark:bg-zinc-900/50 [&_[data-sidebar='sidebar']]:backdrop-blur-sm" {...props}>
      <SidebarHeader>
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* Credit Balance Display */}
        {creditBalance !== null && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <Zap className="h-4 w-4 text-yellow-600" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-yellow-800">
                  {creditBalance} credits
                </div>
                <div className="text-xs text-yellow-600">
                  Available balance
                </div>
              </div>
            </div>
          </div>
        )}
        
        <NavSecondary items={data.navSecondary} />
        <NavUser user={data.user}>
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        </NavUser>
      </SidebarFooter>
    </Sidebar>
  )
}
