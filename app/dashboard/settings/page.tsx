"use client"

import { ApiKeysSection } from "@/components/dashboard/api-keys-section"
import { McpIntegrationGuide } from "@/components/dashboard/mcp-integration-guide"
import { MCPToolsManager } from "@/components/dashboard/MCPToolsManager"
import { UserProfileSection } from "@/components/dashboard/user-profile-section"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [serverUrl, setServerUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setServerUrl(`${window.location.origin}/api/mcp`)
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application settings</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api-keys">MCP Connections</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <UserProfileSection />
        </TabsContent>
        
        <TabsContent value="api-keys" className="space-y-6">
          <ApiKeysSection />
          <McpIntegrationGuide 
            serverUrl={serverUrl} 
          />
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <MCPToolsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
} 