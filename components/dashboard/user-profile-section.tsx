"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, User, Mail, Camera } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/database"

export function UserProfileSection() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.error("No user found")
        return
      }

      // Fetch profile from profiles table
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        toast.error("Failed to load profile")
        return
      }

      // If no profile exists, create one
      if (!profileData) {
        // Google OAuth may provide avatar as 'picture' or 'avatar_url'
        const googleAvatar = user.user_metadata?.avatar_url || 
                           user.user_metadata?.picture || 
                           null
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: googleAvatar
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          toast.error("Failed to create profile")
          return
        }

        setProfile(newProfile)
        setFullName(newProfile.full_name || '')
        setEmail(newProfile.email)
        setAvatarUrl(newProfile.avatar_url)
      } else {
        setProfile(profileData)
        setFullName(profileData.full_name || '')
        setEmail(profileData.email)
        setAvatarUrl(profileData.avatar_url)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast.error("Failed to update profile")
        return
      }

      // Update auth metadata as well
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (authError) {
        console.error('Error updating auth metadata:', authError)
      }

      toast.success("Profile updated successfully")
      
      // Refresh profile data
      await fetchProfile()
    } catch (error) {
      console.error('Error in handleUpdateProfile:', error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${profile.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    try {
      setSaving(true)
      const supabase = createClient()

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (updateError) {
        throw updateError
      }

      // Update auth metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      setAvatarUrl(publicUrl)
      toast.success("Avatar updated successfully")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error("Failed to upload avatar")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} alt={fullName || "User"} />
            <AvatarFallback>
              {fullName ? fullName.charAt(0).toUpperCase() : <User className="h-10 w-10" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                <Camera className="h-4 w-4" />
                Change avatar
              </div>
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={saving}
            />
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, or GIF up to 5MB
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full-name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name
          </Label>
          <Input
            id="full-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={saving}
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed from this page
          </p>
        </div>

        {/* Subscription Status */}
        <div className="space-y-2">
          <Label>Subscription Status</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
            <span className="text-sm font-medium">
              {profile?.subscription_status || 'Free'}
            </span>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/billing">Manage Subscription</a>
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleUpdateProfile}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}