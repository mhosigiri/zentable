"use client"

import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ApiKeysSection } from "@/components/dashboard/api-keys-section"
import { McpIntegrationGuide } from "@/components/dashboard/mcp-integration-guide"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const [serverUrl, setServerUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setServerUrl(`${window.location.origin}/api/mcp`)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
            </div>
            <div className="grid gap-6">
              <ApiKeysSection />
              <McpIntegrationGuide 
                serverUrl={serverUrl} 
              />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
} 