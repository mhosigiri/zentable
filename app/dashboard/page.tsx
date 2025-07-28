"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DataTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"

import { SiteHeader } from "@/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutGridIcon, ListIcon } from "lucide-react"

export default function Page() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* View Toggle */}
                <div className="flex items-center justify-between px-4 lg:px-6">
                  <div>
                    <h1 className="text-2xl font-semibold">My Presentations</h1>
                    <p className="text-muted-foreground">
                      Manage and organize your presentation library
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGridIcon className="w-4 h-4 mr-2" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <ListIcon className="w-4 h-4 mr-2" />
                      List
                    </Button>
                  </div>
                </div>



                {/* Content based on view mode */}
                {viewMode === 'grid' ? (
                  <SectionCards />
                ) : (
                  <DataTable />
                )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </div>
  )
}
