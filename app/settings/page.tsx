"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { userProfile, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  if (!userProfile || !user) return null

  const handlePrivacyUpdate = async (field: string, value: boolean) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`privacy.${field}`]: value,
      })
      toast({
        title: "Settings updated",
        description: "Your privacy settings have been saved.",
      })
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          </div>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <p className="text-sm text-muted-foreground">{userProfile.username}</p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Control who can see your information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Friend Requests</Label>
                  <p className="text-sm text-muted-foreground">Let other players send you friend requests</p>
                </div>
                <Switch
                  checked={userProfile.privacy.allowFriendRequests}
                  onCheckedChange={(checked) => handlePrivacyUpdate("allowFriendRequests", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Lore to Friends</Label>
                  <p className="text-sm text-muted-foreground">Friends can view your unlocked lore entries</p>
                </div>
                <Switch
                  checked={userProfile.privacy.showLoreToFriends}
                  onCheckedChange={(checked) => handlePrivacyUpdate("showLoreToFriends", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Public Leaderboard</Label>
                  <p className="text-sm text-muted-foreground">Appear on the global leaderboard</p>
                </div>
                <Switch
                  checked={userProfile.privacy.publicLeaderboard}
                  onCheckedChange={(checked) => handlePrivacyUpdate("publicLeaderboard", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle>Audio</CardTitle>
              <CardDescription>Sound and music preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Music</Label>
                  <p className="text-sm text-muted-foreground">Background music in the arena</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">UI and battle sound effects</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
