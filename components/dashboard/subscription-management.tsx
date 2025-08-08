"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Calendar, CreditCard, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionInfo {
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  subscription_status: string
  current_period_end: string | null
  cancel_at: string | null
  credits_balance: number
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = React.useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [canceling, setCanceling] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('stripe_subscription_id, stripe_price_id, subscription_status, current_period_end, cancel_at, credits_balance')
        .eq('id', user.id)
        .single()

      setSubscription(data)
    }
    setLoading(false)
  }

  const handleCancelSubscription = async () => {
    setCanceling(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Subscription canceled",
          description: "Your subscription will end at the current billing period. You'll keep your credits until then.",
        })
        await fetchSubscription()
      } else {
        throw new Error(data.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      })
    } finally {
      setCanceling(false)
      setCancelDialogOpen(false)
    }
  }

  const getPlanName = (priceId: string | null) => {
    switch (priceId) {
      case 'price_1RtWl99MDLdB3mTb8iBxZYaY': return 'Lite'
      case 'price_1RtWlA9MDLdB3mTbqz1qLDT5': return 'Plus'
      case 'price_1RtWlA9MDLdB3mTbUMunPLQH': return 'Pro'
      default: return 'Free'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isSubscribed = subscription?.stripe_subscription_id && subscription.subscription_status === 'active'
  const currentPlan = getPlanName(subscription?.stripe_price_id || null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Plan</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold">{currentPlan}</span>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {isSubscribed ? 'Active' : 'Free'}
              </Badge>
            </div>
          </div>

          {/* Billing Period */}
          {isSubscribed && subscription?.current_period_end && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Next Billing Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formatDate(subscription.current_period_end)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Your credits will be refreshed on this date
              </p>
            </div>
          )}

          {/* Cancellation Notice */}
          {isSubscribed && subscription?.cancel_at && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    Subscription Ending
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    Your subscription will end on <strong>{formatDate(subscription.cancel_at)}</strong>. 
                    After this date, your credits will be reset to the free tier (500 credits).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isSubscribed ? (
              <>
                <Link href="/pricing" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Change Plan
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setCancelDialogOpen(true)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  Cancel Subscription
                </Button>
              </>
            ) : (
              <Link href="/pricing" className="w-full">
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            )}
          </div>

          {/* Warning */}
          {!isSubscribed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Limited Credits
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You're on the free plan with limited credits. Upgrade to get monthly credit refreshes and accumulate credits over time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? 
              <br /><br />
              <strong>Important:</strong> When you cancel, your accumulated credits will be reset to 500 (free tier) at the end of your current billing period.
              <br /><br />
              You'll continue to have access to your current plan until {formatDate(subscription?.current_period_end || null)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700"
            >
              {canceling ? 'Canceling...' : 'Yes, Cancel Subscription'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}