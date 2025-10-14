"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Swords, ShoppingBag, Users, Target, Zap } from "lucide-react"
import Link from "next/link"

export default function RealmPage() {
  const { userProfile } = useAuth()

  if (!userProfile) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome Banner */}
          <div className="parchment p-6 rounded-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, <span className="text-primary">{userProfile.username}</span>
            </h1>
            <p className="text-muted-foreground">Ready to conquer new challenges?</p>
          </div>

          {/* Daily Panel */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Daily Challenge
                  </CardTitle>
                  <CardDescription>Complete to earn bonus embers</CardDescription>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 rounded-lg">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="font-bold">+50</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm">Complete 3 trials</span>
                  <span className="text-xs text-muted-foreground">0/3</span>
                </div>
                <Button className="w-full ember-glow" asChild>
                  <Link href="/trials">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Challenge
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/trials" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:ember-glow transition-all">
                    <Swords className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Trials</h3>
                    <p className="text-xs text-muted-foreground">Test your knowledge</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/duels" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:ember-glow transition-all">
                    <Swords className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Duels</h3>
                    <p className="text-xs text-muted-foreground">Challenge friends</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/market" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:ember-glow transition-all">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Market</h3>
                    <p className="text-xs text-muted-foreground">Buy items & themes</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/friends" className="group">
              <Card className="transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto group-hover:ember-glow transition-all">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Friends</h3>
                    <p className="text-xs text-muted-foreground">Connect & chat</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
              <CardDescription>Track your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.quizzesDone}</p>
                  <p className="text-xs text-muted-foreground mt-1">Trials Completed</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.accuracy.toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Accuracy</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg col-span-2 md:col-span-1">
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.totalEmbersEarned}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Embers Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
