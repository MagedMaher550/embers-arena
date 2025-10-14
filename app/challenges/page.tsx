"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, Target, Calendar, Zap, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const dailyChallenges = [
  {
    id: "daily-1",
    title: "Complete 3 Trials",
    description: "Finish any 3 knowledge trials",
    reward: 50,
    progress: 0,
    total: 3,
    type: "daily",
  },
  {
    id: "daily-2",
    title: "Perfect Score",
    description: "Get 100% accuracy on any trial",
    reward: 75,
    progress: 0,
    total: 1,
    type: "daily",
  },
  {
    id: "daily-3",
    title: "Win a Duel",
    description: "Defeat an opponent in a duel",
    reward: 60,
    progress: 0,
    total: 1,
    type: "daily",
  },
]

const weeklyChallenges = [
  {
    id: "weekly-1",
    title: "Trial Master",
    description: "Complete 20 trials this week",
    reward: 200,
    progress: 5,
    total: 20,
    type: "weekly",
  },
  {
    id: "weekly-2",
    title: "Social Butterfly",
    description: "Add 5 new friends",
    reward: 150,
    progress: 2,
    total: 5,
    type: "weekly",
  },
  {
    id: "weekly-3",
    title: "Shopping Spree",
    description: "Purchase 3 items from the market",
    reward: 100,
    progress: 1,
    total: 3,
    type: "weekly",
  },
]

export default function ChallengesPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Challenges</h1>
            <p className="text-muted-foreground">Complete challenges to earn bonus embers</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="daily">
                <Calendar className="w-4 h-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly">
                <Zap className="w-4 h-4 mr-2" />
                Weekly
              </TabsTrigger>
            </TabsList>

            {/* Daily Challenges */}
            <TabsContent value="daily" className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <span className="font-bold">Daily Reset in 8h 32m</span>
                    </div>
                    <Badge variant="outline">3 Available</Badge>
                  </div>
                </CardContent>
              </Card>

              {dailyChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </TabsContent>

            {/* Weekly Challenges */}
            <TabsContent value="weekly" className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-bold">Weekly Reset in 3d 8h</span>
                    </div>
                    <Badge variant="outline">3 Available</Badge>
                  </div>
                </CardContent>
              </Card>

              {weeklyChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </TabsContent>
          </Tabs>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}

function ChallengeCard({ challenge }: { challenge: any }) {
  const progressPercent = (challenge.progress / challenge.total) * 100
  const isComplete = challenge.progress >= challenge.total

  return (
    <Card className={isComplete ? "border-green-500/50 bg-green-500/5" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{challenge.title}</CardTitle>
              {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            </div>
            <CardDescription>{challenge.description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-primary shrink-0">
            <Flame className="w-5 h-5" />
            <span className="font-bold text-lg">+{challenge.reward}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold">
              {challenge.progress}/{challenge.total}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {!isComplete && (
          <Button className="w-full" asChild>
            <Link href="/trials">Start Challenge</Link>
          </Button>
        )}

        {isComplete && (
          <Button className="w-full ember-glow" disabled>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Completed
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
