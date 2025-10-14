"use client"

import { use, useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Flame, Swords, ArrowLeft, UserPlus, Crown, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import type { UserProfile } from "@/lib/firebase/auth"

export default function UserProfilePage({ params }: { params: Promise<{ uid: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [resolvedParams.uid])

  const loadProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", resolvedParams.uid))
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">User not found</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center ember-glow-strong">
                  <Shield className="w-12 h-12 text-primary" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold">{profile.username}</h1>
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{profile.title}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-lg">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="font-bold">Level {profile.level}</span>
                    </div>
                    {profile.privacy.publicLeaderboard && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                        <Flame className="w-4 h-4 text-primary" />
                        <span className="font-bold">{profile.embers} Embers</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="ember-glow">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Friend
                  </Button>
                  <Button variant="outline">
                    <Swords className="w-4 h-4 mr-2" />
                    Challenge
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          {profile.privacy.publicLeaderboard && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Battle Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm text-muted-foreground">Trials Completed</p>
                    <p className="text-3xl font-bold text-primary">{profile.stats.quizzesDone}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    <p className="text-3xl font-bold text-primary">{profile.stats.accuracy.toFixed(1)}%</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="text-sm text-muted-foreground">Total Embers</p>
                    <p className="text-3xl font-bold text-primary">{profile.stats.totalEmbersEarned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!profile.privacy.publicLeaderboard && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">This warrior's stats are private</p>
              </CardContent>
            </Card>
          )}
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
