"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Crown, Medal, Award, Shield } from "lucide-react"
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/contexts/auth-context"
import type { UserProfile } from "@/lib/firebase/auth"
import Link from "next/link"

interface LeaderboardEntry extends UserProfile {
  rank?: number
}

export default function LeaderboardPage() {
  const { userProfile, user } = useAuth()
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([])
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboards()
  }, [user])

  const loadLeaderboards = async () => {
    try {
      // Load global leaderboard
      const usersRef = collection(db, "users")
      const globalQuery = query(
        usersRef,
        where("privacy.publicLeaderboard", "==", true),
        orderBy("stats.totalEmbersEarned", "desc"),
        limit(50),
      )
      const globalSnapshot = await getDocs(globalQuery)
      const globalData = globalSnapshot.docs.map((doc, index) => ({
        ...doc.data(),
        rank: index + 1,
      })) as LeaderboardEntry[]
      setGlobalLeaderboard(globalData)

      // Load friends leaderboard
      if (user) {
        const friendsDoc = await getDoc(doc(db, "friends", user.uid))
        const friendsData = friendsDoc.data()

        if (friendsData?.confirmed?.length > 0) {
          const friendProfiles = await Promise.all(
            friendsData.confirmed.map(async (uid: string) => {
              const userDoc = await getDoc(doc(db, "users", uid))
              return userDoc.data() as UserProfile
            }),
          )

          const sortedFriends = friendProfiles
            .sort((a, b) => b.stats.totalEmbersEarned - a.stats.totalEmbersEarned)
            .map((friend, index) => ({
              ...friend,
              rank: index + 1,
            }))

          setFriendsLeaderboard(sortedFriends)
        }
      }
    } catch (error) {
      console.error("Error loading leaderboards:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!userProfile) return null

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading leaderboard...</p>
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

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground">Top warriors in the arena</p>
          </div>

          {/* Top 3 Podium */}
          {globalLeaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center pt-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-500/20 rounded-full flex items-center justify-center mb-2 border-2 border-gray-500">
                  <Medal className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <Badge className="mb-2 bg-gray-500/20 text-gray-400 border-gray-500/50">2nd</Badge>
                <p className="font-bold text-sm md:text-base text-center truncate w-full">
                  {globalLeaderboard[1].username}
                </p>
                <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                  <Flame className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{globalLeaderboard[1].stats.totalEmbersEarned}</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <Crown className="w-8 h-8 text-amber-400 mb-2 animate-pulse" />
                <div className="w-20 h-20 md:w-24 md:h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-2 border-4 border-amber-500 ember-glow-strong">
                  <Trophy className="w-10 h-10 md:w-12 md:h-12 text-amber-400" />
                </div>
                <Badge className="mb-2 bg-amber-500/20 text-amber-400 border-amber-500/50">1st</Badge>
                <p className="font-bold text-base md:text-lg text-center truncate w-full">
                  {globalLeaderboard[0].username}
                </p>
                <div className="flex items-center gap-1 text-sm md:text-base text-primary">
                  <Flame className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-bold">{globalLeaderboard[0].stats.totalEmbersEarned}</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center pt-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-2 border-2 border-orange-500">
                  <Award className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
                </div>
                <Badge className="mb-2 bg-orange-500/20 text-orange-400 border-orange-500/50">3rd</Badge>
                <p className="font-bold text-sm md:text-base text-center truncate w-full">
                  {globalLeaderboard[2].username}
                </p>
                <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                  <Flame className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{globalLeaderboard[2].stats.totalEmbersEarned}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>

            {/* Global Leaderboard */}
            <TabsContent value="global" className="space-y-2">
              {globalLeaderboard.slice(3).map((entry) => (
                <LeaderboardRow key={entry.uid} entry={entry} isCurrentUser={entry.uid === user?.uid} />
              ))}
            </TabsContent>

            {/* Friends Leaderboard */}
            <TabsContent value="friends" className="space-y-2">
              {friendsLeaderboard.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Add friends to see their rankings</p>
                  </CardContent>
                </Card>
              ) : (
                friendsLeaderboard.map((entry) => (
                  <LeaderboardRow key={entry.uid} entry={entry} isCurrentUser={entry.uid === user?.uid} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  const getRankColor = (rank?: number) => {
    if (!rank) return "text-muted-foreground"
    if (rank <= 3) return "text-primary font-bold"
    if (rank <= 10) return "text-primary"
    return "text-muted-foreground"
  }

  return (
    <Link href={`/profile/${entry.uid}`}>
      <Card
        className={`transition-all hover:border-primary/50 ${isCurrentUser ? "border-primary/30 bg-primary/5" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank */}
            <div className={`w-8 text-center font-bold ${getRankColor(entry.rank)}`}>#{entry.rank}</div>

            {/* Avatar */}
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold truncate">{entry.username}</p>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">
                    You
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Level {entry.level}</p>
            </div>

            {/* Stats */}
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 justify-end mb-1">
                <Flame className="w-4 h-4 text-primary" />
                <span className="font-bold">{entry.stats.totalEmbersEarned}</span>
              </div>
              <p className="text-xs text-muted-foreground">{entry.stats.quizzesDone} trials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
