"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase/config"
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Swords, Trophy, Clock, Flame, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Duel {
  id: string
  challengerId: string
  challengerName: string
  challengerAvatar: string
  opponentId: string
  opponentName: string
  opponentAvatar: string
  quizId: string
  quizTitle: string
  status: "pending" | "active" | "completed"
  wager: number
  challengerScore?: number
  opponentScore?: number
  winnerId?: string
  createdAt: any
}

interface Friend {
  uid: string
  username: string
  avatar: string
  level: number
}

export default function DuelsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [duels, setDuels] = useState<Duel[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [wager, setWager] = useState(50)

  useEffect(() => {
    if (user) {
      loadDuels()
      loadFriends()
    }
  }, [user])

  const loadDuels = async () => {
    if (!user) return

    try {
      const duelsRef = collection(db, "duels")
      const q = query(
        duelsRef,
        where("participants", "array-contains", user.uid),
        orderBy("createdAt", "desc"),
        limit(20),
      )
      const snapshot = await getDocs(q)
      const duelsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Duel[]
      setDuels(duelsData)
    } catch (error) {
      console.error("Error loading duels:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadFriends = async () => {
    if (!user) return

    try {
      const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)))
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data()
        const friendIds = userData.friends || []

        if (friendIds.length > 0) {
          const friendsQuery = query(collection(db, "users"), where("uid", "in", friendIds))
          const friendsSnapshot = await getDocs(friendsQuery)
          const friendsData = friendsSnapshot.docs.map((doc) => doc.data() as Friend)
          setFriends(friendsData)
        }
      }
    } catch (error) {
      console.error("Error loading friends:", error)
    }
  }

  const createDuel = async (friendId: string, friendName: string, friendAvatar: string) => {
    if (!user) return

    try {
      const duelData = {
        challengerId: user.uid,
        challengerName: user.displayName || "Anonymous",
        challengerAvatar: user.photoURL || "🔥",
        opponentId: friendId,
        opponentName: friendName,
        opponentAvatar: friendAvatar,
        quizId: "general-knowledge",
        quizTitle: "General Knowledge",
        status: "pending",
        wager,
        participants: [user.uid, friendId],
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, "duels"), duelData)
      setSelectedFriend(null)
      loadDuels()
    } catch (error) {
      console.error("Error creating duel:", error)
    }
  }

  const acceptDuel = async (duelId: string) => {
    try {
      await updateDoc(doc(db, "duels", duelId), {
        status: "active",
      })
      router.push(`/duels/${duelId}`)
    } catch (error) {
      console.error("Error accepting duel:", error)
    }
  }

  const pendingDuels = duels.filter((d) => d.status === "pending" && d.opponentId === user?.uid)
  const activeDuels = duels.filter((d) => d.status === "active")
  const completedDuels = duels.filter((d) => d.status === "completed")

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-12 h-12 text-accent animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading duels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Swords className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold text-balance">Battle Arena</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Send className="w-4 h-4 mr-2" />
                Challenge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-accent/20">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-accent" />
                  Challenge a Friend
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Ember Wager</label>
                  <input
                    type="number"
                    value={wager}
                    onChange={(e) => setWager(Number(e.target.value))}
                    min={10}
                    max={500}
                    step={10}
                    className="w-full px-4 py-2 bg-background border border-accent/20 rounded-lg text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Select Friend</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {friends.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No friends to challenge</p>
                    ) : (
                      friends.map((friend) => (
                        <button
                          key={friend.uid}
                          onClick={() => createDuel(friend.uid, friend.username, friend.avatar)}
                          className="w-full flex items-center gap-3 p-3 bg-background hover:bg-accent/10 border border-accent/20 rounded-lg transition-colors"
                        >
                          <div className="text-2xl">{friend.avatar}</div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold">{friend.username}</p>
                            <p className="text-sm text-muted-foreground">Level {friend.level}</p>
                          </div>
                          <Badge variant="outline" className="border-accent/30">
                            {wager} <Flame className="w-3 h-3 ml-1 text-accent" />
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50">
            <TabsTrigger value="pending">Pending ({pendingDuels.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeDuels.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedDuels.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingDuels.length === 0 ? (
              <Card className="p-8 text-center bg-card/50 border-accent/20">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending challenges</p>
              </Card>
            ) : (
              pendingDuels.map((duel) => (
                <Card key={duel.id} className="p-4 bg-card/50 border-accent/20">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{duel.challengerAvatar}</div>
                    <div className="flex-1">
                      <p className="font-semibold">{duel.challengerName}</p>
                      <p className="text-sm text-muted-foreground">{duel.quizTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-accent/30">
                          {duel.wager} <Flame className="w-3 h-3 ml-1 text-accent" />
                        </Badge>
                      </div>
                    </div>
                    <Button onClick={() => acceptDuel(duel.id)} className="bg-accent hover:bg-accent/90">
                      Accept
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeDuels.length === 0 ? (
              <Card className="p-8 text-center bg-card/50 border-accent/20">
                <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active duels</p>
              </Card>
            ) : (
              activeDuels.map((duel) => (
                <Link key={duel.id} href={`/duels/${duel.id}`}>
                  <Card className="p-4 bg-card/50 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{duel.challengerAvatar}</div>
                        <Swords className="w-5 h-5 text-accent" />
                        <div className="text-2xl">{duel.opponentAvatar}</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {duel.challengerName} vs {duel.opponentName}
                        </p>
                        <p className="text-sm text-muted-foreground">{duel.quizTitle}</p>
                      </div>
                      <Badge className="bg-accent/20 text-accent border-accent/30">In Progress</Badge>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedDuels.length === 0 ? (
              <Card className="p-8 text-center bg-card/50 border-accent/20">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed duels</p>
              </Card>
            ) : (
              completedDuels.map((duel) => {
                const isWinner = duel.winnerId === user?.uid
                return (
                  <Card
                    key={duel.id}
                    className={`p-4 border-2 ${isWinner ? "bg-accent/5 border-accent/40" : "bg-card/50 border-accent/20"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{duel.challengerAvatar}</div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">vs</p>
                        </div>
                        <div className="text-2xl">{duel.opponentAvatar}</div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {duel.challengerName} vs {duel.opponentName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {duel.challengerScore} - {duel.opponentScore}
                        </p>
                      </div>
                      {isWinner && (
                        <Badge className="bg-accent text-background">
                          <Trophy className="w-3 h-3 mr-1" />
                          Victory
                        </Badge>
                      )}
                    </div>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
