"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Zap, TrendingUp, Calendar, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getCreditStatsClient } from "@/lib/credits-client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle } from "lucide-react"
import { SubscriptionManagement } from "@/components/dashboard/subscription-management"

interface CreditTransaction {
  id: string
  action_type: string
  credits_used: number
  credits_before: number
  credits_after: number
  metadata: any
  created_at: string
}

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [creditStats, setCreditStats] = React.useState<{
    balance: number;
    totalUsed: number;
    subscriptionStatus: string;
  } | null>(null)
  const [transactions, setTransactions] = React.useState<CreditTransaction[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showDemo, setShowDemo] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  React.useEffect(() => {
    const fetchBillingData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get credit stats
        const stats = await getCreditStatsClient()
        setCreditStats(stats)

        // Get recent transactions
        const { data: transactionData } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (transactionData) {
          setTransactions(transactionData)
        }
      }
      setLoading(false)
    }
    
    fetchBillingData()
    
    // Check for demo mode parameter
    const demo = searchParams?.get('demo')
    const plan = searchParams?.get('plan')
    const success = searchParams?.get('success')
    
    if (demo === 'true') {
      setShowDemo(true)
    }
    
    if (success === 'true') {
      setShowSuccess(true)
    }
  }, [searchParams])

  const getActionLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      presentation_create: "Presentation Created",
      slide_generate: "Slide Generated",
      image_generate: "Image Generated",
      chat_message: "Chat Message",
      brainstorming: "Brainstorming Session",
      credit_purchase: "Credits Purchased",
      credit_grant: "Credits Granted",
      plan_upgrade: "Plan Upgraded",
      plan_downgrade: "Plan Downgraded"
    }
    return labels[actionType] || actionType
  }

  const getSubscriptionColor = (status: string) => {
    switch (status) {
      case 'pro': return 'bg-purple-100 text-purple-800'
      case 'plus': return 'bg-blue-100 text-blue-800'
      case 'lite': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const totalCreditsEarned = creditStats ? creditStats.balance + creditStats.totalUsed : 0
  const usagePercentage = totalCreditsEarned > 0 ? (creditStats?.totalUsed || 0) / totalCreditsEarned * 100 : 0

  return (
    <div className="p-6 space-y-6">
      {/* Success Alert */}
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your payment has been processed successfully and credits have been added to your account.
          </AlertDescription>
        </Alert>
      )}

      {/* Demo Mode Alert */}
      {showDemo && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Mode</AlertTitle>
          <AlertDescription>
            This is a demo of the billing system. To enable real payments, configure your Stripe secret key in the environment variables.
            {searchParams?.get('plan') && ` You attempted to purchase: ${searchParams.get('plan')}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600 mt-1">Manage your credits and subscription</p>
        </div>
        <Link href="/pricing">
          <Button>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </Link>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditStats?.balance || 0}</div>
            <p className="text-xs text-muted-foreground">
              Ready to use for AI features
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditStats?.totalUsed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total credits consumed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">
                {creditStats?.subscriptionStatus || 'Free'}
              </div>
              <Badge className={getSubscriptionColor(creditStats?.subscriptionStatus || 'free')}>
                Active
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Subscription status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage Overview</CardTitle>
          <CardDescription>
            Your credit consumption across all AI features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Credits Used</span>
              <span>{creditStats?.totalUsed || 0} / {totalCreditsEarned}</span>
            </div>
            {/* <Progress value={usagePercentage} className="w-full" /> */}
            <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {usagePercentage.toFixed(1)}% of total credits earned have been used
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest credit transactions and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start using AI features to see your activity here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${
                          transaction.credits_used < 0 ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {getActionLabel(transaction.action_type)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                          {new Date(transaction.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${
                        transaction.credits_used < 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.credits_used < 0 ? '+' : '-'}{Math.abs(transaction.credits_used)} credits
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: {transaction.credits_after}
                      </p>
                    </div>
                  </div>
                  {index < transactions.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <SubscriptionManagement />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your account and billing preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/pricing">
              <Button variant="outline" className="w-full justify-start">
                <ArrowUpRight className="w-4 h-4 mr-2" />
                View All Plans
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" disabled>
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Payment Methods
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}