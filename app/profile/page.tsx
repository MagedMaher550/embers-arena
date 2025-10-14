"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { useAuth } from "@/contexts/auth-context"
import { useTheme, themes } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Sword, Shield, Wand2, Crown, Settings } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const avatarIcons = {
  warrior: Sword,
  guardian: Shield,
  mage: Wand2,
}

export default function ProfilePage() {
  const { userProfile, user } = useAuth()
  const { currentTheme, setTheme } = useTheme()
  const { toast } = useToast()

  if (!userProfile || !user) return null

  const handleThemeChange = async (themeId: string) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        equippedTheme: themeId,
      })
      setTheme(themeId)
      toast({
        title: "Theme updated",
        description: "Your new theme has been applied.",
      })
    } catch (error) {
      toast({
        title: "Failed to update theme",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const AvatarIcon = avatarIcons[userProfile.avatar as keyof typeof avatarIcons] || Sword

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Profile Header */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center ember-glow-strong shrink-0">
                  <AvatarIcon className="w-12 h-12 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <h1 className="text-2xl md:text-3xl font-bold">{userProfile.username}</h1>
                      <Crown className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-muted-foreground">{userProfile.title}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-lg">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="font-bold">Level {userProfile.level}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                      <Flame className="w-4 h-4 text-primary" />
                      <span className="font-bold">{userProfile.embers} Embers</span>
                    </div>
                    {userProfile.streakDays > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                        <Flame className="w-4 h-4 text-primary" />
                        <span className="font-bold">{userProfile.streakDays} Day Streak</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings Button */}
                <Link href="/settings">
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Battle Statistics</CardTitle>
              <CardDescription>Your performance in the arena</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Trials Completed</p>
                  <p className="text-3xl font-bold text-primary">{userProfile.stats.quizzesDone}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-primary">{userProfile.stats.accuracy.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm text-muted-foreground">Total Embers</p>
                  <p className="text-3xl font-bold text-primary">{userProfile.stats.totalEmbersEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Picker */}
          <Card>
            <CardHeader>
              <CardTitle>Realm Theme</CardTitle>
              <CardDescription>Customize your arena appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(themes).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      currentTheme.id === theme.id
                        ? "border-primary bg-primary/10 ember-glow"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                      <div>
                        <h3 className="font-bold">{theme.name}</h3>
                        {currentTheme.id === theme.id && <p className="text-xs text-primary">Active</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.palette.bg }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.palette.panel }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.palette.muted }} />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Your collected items and cosmetics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Visit the Market to unlock new items</p>
                <Button className="mt-4" asChild>
                  <Link href="/market">Browse Market</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
