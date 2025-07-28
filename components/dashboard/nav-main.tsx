"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white duration-300 ease-out hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg active:from-emerald-700 active:to-teal-700 shadow-lg border-none rounded-xl transform hover:scale-105"
              onClick={() => router.push('/create')}
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            {/* <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} onClick={() => router.push(item.url)} className="hover:bg-gradient-to-r hover:from-blue-100 hover:via-purple-50 hover:to-pink-100 dark:hover:from-blue-800/30 dark:hover:via-purple-800/20 dark:hover:to-pink-800/30 transition-all duration-300 rounded-lg transform hover:scale-[1.02]">
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
