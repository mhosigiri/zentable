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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [profile, setProfile] = React.useState<Profile | null>(null)
  
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
    <Sidebar collapsible="offcanvas" {...props}>
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
