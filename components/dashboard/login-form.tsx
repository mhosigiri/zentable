'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BorderBeam } from '@/components/ui/border-beam'
import { useState } from 'react'
import { Sparkles, ArrowRight, Shield, Zap } from 'lucide-react'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
        <BorderBeam size={250} duration={12} colorFrom="#8B5CF6" colorTo="#3B82F6" />
        
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Sign in to unleash the power of AI-driven presentations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSocialLogin}>
            <div className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    {error}
                  </p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                )}
              </Button>
              
              {/* Security badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="w-3 h-3 mr-1 text-green-500" />
                  Secure OAuth
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                  Instant Access
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Additional Info */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100/80 text-purple-800 text-xs font-medium backdrop-blur-sm">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered • Secure • Fast
        </div>
        <p className="text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
