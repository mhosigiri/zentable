"use client"

import * as React from "react"
import { Check, CreditCard, Zap, Star, Crown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { getCreditStatsClient } from "@/lib/credits-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
// We'll load the price IDs dynamically on the client
const getPlans = (priceIds: { lite: string; plus: string; pro: string }) => [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out AI presentations",
    credits: "500 one-time credits",
    features: [
      "500 AI credits included",
      "Basic presentation generation",
      "Standard slide templates", 
      "Image generation",
      "Chat assistance",
      "Export to PDF"
    ],
    buttonText: "Get Started Free",
    buttonVariant: "outline" as const,
    disabled: false,
    icon: Zap,
    popular: false
  },
  {
    name: "Lite",
    price: "$5",
    priceId: priceIds.lite,
    description: "Great for occasional presentation creators",
    credits: "1,000 credits",
    period: "/month",
    features: [
      "1,000 AI credits monthly",
      "Credits accumulate each month",
      "Advanced presentation generation",
      "All slide templates",
      "High-quality image generation",
      "Priority chat assistance",
      "Export to PDF",
      "Email support"
    ],
    buttonText: "Subscribe to Lite",
    buttonVariant: "outline" as const,
    disabled: false,
    icon: CreditCard,
    popular: false
  },
  {
    name: "Plus",
    price: "$10",
    priceId: priceIds.plus,
    description: "Perfect for regular presentation needs",
    credits: "2,500 credits",
    period: "/month",
    features: [
      "2,500 AI credits monthly",
      "Credits accumulate each month",
      "Advanced presentation generation",
      "All premium templates",
      "High-quality image generation",
      "Priority chat assistance",
      "Advanced brainstorming tools",
      "Export to PDF",
      "Priority email support"
    ],
    buttonText: "Subscribe to Plus",
    buttonVariant: "default" as const,
    disabled: false,
    icon: Star,
    popular: true
  },
  {
    name: "Pro",
    price: "$20",
    priceId: priceIds.pro,
    description: "For power users and teams",
    credits: "7,500 credits",
    period: "/month",
    features: [
      "7,500 AI credits monthly",
      "Credits accumulate each month",
      "Advanced presentation generation",
      "All premium templates",
      "High-quality image generation",
      "Priority chat assistance",
      "Advanced brainstorming tools",
      "MCP tool integration",
      "Export to PDF",
      "Priority email support",
      "Phone support"
    ],
    buttonText: "Subscribe to Pro",
    buttonVariant: "default" as const,
    disabled: false,
    icon: Crown,
    popular: false
  }
]

const creditCosts = [
  { action: "Create Presentation Outline", cost: 10 },
  { action: "Generate AI Slide", cost: 5 },
  { action: "Generate AI Image", cost: 2 },
  { action: "Chat Message", cost: 2 },
  { action: "Brainstorming Session", cost: 3 }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [creditStats, setCreditStats] = useState<{
    balance: number;
    totalUsed: number;
    subscriptionStatus: string;
  } | null>(null)
  const [user, setUser] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    const fetchUserAndStats = async () => {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      setUser(currentUser)
      
      if (currentUser) {
        const stats = await getCreditStatsClient()
        setCreditStats(stats)
        
        // Get current subscription details
        const { data: profile } = await supabase
          .from('profiles')
          .select('stripe_price_id, subscription_status')
          .eq('id', currentUser.id)
          .single()
          
        if (profile?.stripe_price_id && profile.subscription_status === 'active') {
          setCurrentPriceId(profile.stripe_price_id)
        }
      }
    }

    const fetchStripeConfig = async () => {
      try {
        const response = await fetch('/api/stripe/config')
        const config = await response.json()
        
        // Generate plans with the correct price IDs
        const plansWithPrices = getPlans(config.prices)
        setPlans(plansWithPrices)
      } catch (error) {
        // console.error('Error fetching Stripe config:', error)
        // Fallback to test prices if config fails
        const fallbackPrices = {
          lite: 'price_1RtWl99MDLdB3mTb8iBxZYaY',
          plus: 'price_1RtWlA9MDLdB3mTbqz1qLDT5', 
          pro: 'price_1RtWlA9MDLdB3mTbUMunPLQH'
        }
        const plansWithPrices = getPlans(fallbackPrices)
        setPlans(plansWithPrices)
      }
    }
    
    fetchUserAndStats()
    fetchStripeConfig()
  }, [])

  const handlePurchase = async (priceId: string, planName: string) => {
    if (!priceId) {
      // Handle free plan - just redirect to dashboard
      if (planName === "Free") {
        router.push('/dashboard')
        return
      }
      return
    }
    
    setLoading(priceId)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Always use Stripe checkout for plan changes/subscriptions
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl
      } else {
        // console.error('Checkout creation failed:', data.error)
        alert(data.error || 'Failed to create checkout. Please try again.')
      }
    } catch (error) {
      // console.error('Purchase error:', error)
      // Fallback to billing page
      router.push('/dashboard/billing')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200/20 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/Zentable_icon.png" 
                alt="Zentable Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Zentable
              </span>
            </Link>
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/billing">
                    <Button variant="outline">
                      Billing
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your AI presentation needs
          </p>
          
          {creditStats && (
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Current Balance: {creditStats.balance} credits</span>
              <Badge variant="secondary" className="ml-2">
                {creditStats.subscriptionStatus}
              </Badge>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isCurrentPlan = plan.priceId && plan.priceId === currentPriceId
            
            return (
              <Card 
                key={index} 
                className={`relative ${plan.popular && !isCurrentPlan ? 'ring-2 ring-blue-500 scale-105' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500 scale-105' : ''} hover:shadow-lg transition-all duration-200`}
              >
                {plan.popular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Current Plan</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mt-2">
                    {plan.credits}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "secondary" : plan.buttonVariant}
                    disabled={plan.disabled || loading === plan.priceId || isCurrentPlan}
                    onClick={() => plan.priceId && handlePurchase(plan.priceId, plan.name)}
                  >
                    {loading === plan.priceId ? 'Processing...' : 
                     isCurrentPlan ? 'Current Plan' : 
                     plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">What are credits?</h3>
              <p className="text-gray-600 text-sm">
                Credits are used for AI-powered features like generating presentations, slides, images, and chat interactions. With 500 credits, you can create around 10 presentations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do credits expire?</h3>
              <p className="text-gray-600 text-sm">
                Credits accumulate month-to-month on paid plans. Free users get 500 one-time credits. If you cancel a paid plan, you'll return to whatever remains of your original 500 free credits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can change your plan at any time through the billing page. Your accumulated credits remain when switching between paid plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens if I cancel?</h3>
              <p className="text-gray-600 text-sm">
                If you cancel your subscription, you'll keep access until the end of your billing period. When returning to the free plan, your credits will reset to 500.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <footer className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-16 mt-20">
        <div className="w-full px-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <img 
                  src="/assets/Zentable_icon.png" 
                  alt="Zentable Logo" 
                  className="h-10 w-10"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Zentable
                </span>
              </div>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Transform your ideas into captivating visual stories with AI-powered presentation generation.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-2">∞</div>
                  <div className="text-gray-300">Unlimited Creativity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">10x</div>
                  <div className="text-gray-300">Faster Production</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">100%</div>
                  <div className="text-gray-300">Professional Quality</div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-8">
                <p className="text-gray-400 mb-4">
                  © 2024 Zent. Empowering ideas through AI.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-400">
                  <Link href="/docs-section" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                  {user ? (
                    <Link href="/dashboard" className="hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/auth/login" className="hover:text-white transition-colors">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  )
}