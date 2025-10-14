"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, UserPlus, UserMinus, Swords, Flame, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/lib/firebase/auth"

interface FriendData extends UserProfile {
  status?: "online" | "offline" | "in-battle"
}

export default function FriendsPage() {
  const { userProfile, user } = useAuth()
  const { toast } = useToast()
  const [friends, setFriends] = useState<FriendData[]>([])
  const [pendingRequests, setPendingRequests] = useState<FriendData[]>([])
  const [sentRequests, setSentRequests] = useState<FriendData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadFriends()
    }
  }, [user])

  const loadFriends = async () => {
    if (!user) return

    try {
      const friendsDoc = await getDoc(doc(db, "friends", user.uid))
      const friendsData = friendsDoc.data()

      if (friendsData) {
        // Load confirmed friends
        if (friendsData.confirmed?.length > 0) {
          const friendProfiles = await Promise.all(
            friendsData.confirmed.map(async (uid: string) => {
              const userDoc = await getDoc(doc(db, "users", uid))
              return { ...userDoc.data(), status: "offline" } as FriendData
            }),
          )
          setFriends(friendProfiles)
        }

        // Load pending received requests
        if (friendsData.pendingReceived?.length > 0) {
          const pendingProfiles = await Promise.all(
            friendsData.pendingReceived.map(async (uid: string) => {
              const userDoc = await getDoc(doc(db, "users", uid))
              return userDoc.data() as FriendData
            }),
          )
          setPendingRequests(pendingProfiles)
        }

        // Load sent requests
        if (friendsData.pendingSent?.length > 0) {
          const sentProfiles = await Promise.all(
            friendsData.pendingSent.map(async (uid: string) => {
              const userDoc = await getDoc(doc(db, "users", uid))
              return userDoc.data() as FriendData
            }),
          )
          setSentRequests(sentProfiles)
        }
      }
    } catch (error) {
      console.error("Error loading friends:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("username", ">=", searchQuery), where("username", "<=", searchQuery + "\uf8ff"))
      const snapshot = await getDocs(q)
      const results = snapshot.docs
        .map((doc) => doc.data() as UserProfile)
        .filter((profile) => profile.uid !== user?.uid)

      setSearchResults(results)
    } catch (error) {
      console.error("Error searching users:", error)
    } finally {
      setSearching(false)
    }
  }

  const sendFriendRequest = async (targetUid: string) => {
    if (!user) return

    try {
      // Update sender's friends doc
      const senderRef = doc(db, "friends", user.uid)
      const senderDoc = await getDoc(senderRef)

      if (!senderDoc.exists()) {
        await updateDoc(senderRef, {
          confirmed: [],
          pendingSent: [targetUid],
          pendingReceived: [],
        })
      } else {
        await updateDoc(senderRef, {
          pendingSent: arrayUnion(targetUid),
        })
      }

      // Update receiver's friends doc
      const receiverRef = doc(db, "friends", targetUid)
      const receiverDoc = await getDoc(receiverRef)

      if (!receiverDoc.exists()) {
        await updateDoc(receiverRef, {
          confirmed: [],
          pendingSent: [],
          pendingReceived: [user.uid],
        })
      } else {
        await updateDoc(receiverRef, {
          pendingReceived: arrayUnion(user.uid),
        })
      }

      toast({
        title: "Friend request sent",
        description: "Your request has been sent successfully.",
      })

      setShowSearchDialog(false)
      loadFriends()
    } catch (error) {
      console.error("Error sending friend request:", error)
      toast({
        title: "Failed to send request",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const acceptFriendRequest = async (friendUid: string) => {
    if (!user) return

    try {
      // Update current user's friends doc
      await updateDoc(doc(db, "friends", user.uid), {
        confirmed: arrayUnion(friendUid),
        pendingReceived: arrayRemove(friendUid),
      })

      // Update friend's friends doc
      await updateDoc(doc(db, "friends", friendUid), {
        confirmed: arrayUnion(user.uid),
        pendingSent: arrayRemove(user.uid),
      })

      toast({
        title: "Friend request accepted",
        description: "You are now friends!",
      })

      loadFriends()
    } catch (error) {
      console.error("Error accepting friend request:", error)
      toast({
        title: "Failed to accept request",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const declineFriendRequest = async (friendUid: string) => {
    if (!user) return

    try {
      await updateDoc(doc(db, "friends", user.uid), {
        pendingReceived: arrayRemove(friendUid),
      })

      await updateDoc(doc(db, "friends", friendUid), {
        pendingSent: arrayRemove(user.uid),
      })

      toast({
        title: "Request declined",
        description: "Friend request has been declined.",
      })

      loadFriends()
    } catch (error) {
      console.error("Error declining friend request:", error)
    }
  }

  const removeFriend = async (friendUid: string) => {
    if (!user) return

    try {
      await updateDoc(doc(db, "friends", user.uid), {
        confirmed: arrayRemove(friendUid),
      })

      await updateDoc(doc(db, "friends", friendUid), {
        confirmed: arrayRemove(user.uid),
      })

      toast({
        title: "Friend removed",
        description: "You are no longer friends.",
      })

      loadFriends()
    } catch (error) {
      console.error("Error removing friend:", error)
    }
  }

  if (!userProfile) return null

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading friends...</p>
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
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold">Friends</h1>
              <p className="text-muted-foreground">Connect with other warriors</p>
            </div>
            <Button onClick={() => setShowSearchDialog(true)} className="ember-glow">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
              <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
            </TabsList>

            {/* Friends List */}
            <TabsContent value="friends" className="space-y-4">
              {friends.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center space-y-4">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto" />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">No friends yet</h3>
                      <p className="text-muted-foreground">Start adding friends to compete and chat</p>
                    </div>
                    <Button onClick={() => setShowSearchDialog(true)}>Find Friends</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friend) => (
                    <FriendCard key={friend.uid} friend={friend} onRemove={removeFriend} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Pending Requests */}
            <TabsContent value="requests" className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No pending requests</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingRequests.map((request) => (
                    <RequestCard
                      key={request.uid}
                      user={request}
                      onAccept={acceptFriendRequest}
                      onDecline={declineFriendRequest}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Sent Requests */}
            <TabsContent value="sent" className="space-y-4">
              {sentRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No sent requests</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sentRequests.map((request) => (
                    <Card key={request.uid}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                              <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold">{request.username}</p>
                              <p className="text-sm text-muted-foreground">Level {request.level}</p>
                            </div>
                          </div>
                          <Badge variant="outline">Pending</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        <BottomNav />

        {/* Search Dialog */}
        <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Find Friends</DialogTitle>
              <DialogDescription>Search for warriors by username</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={searching}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map((result) => (
                    <Card key={result.uid}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{result.username}</p>
                              <p className="text-xs text-muted-foreground">Level {result.level}</p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => sendFriendRequest(result.uid)}>
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !searching && (
                <p className="text-center text-sm text-muted-foreground py-4">No users found</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

function FriendCard({ friend, onRemove }: { friend: FriendData; onRemove: (uid: string) => void }) {
  return (
    <Card className="group hover:border-primary/50 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-bold">{friend.username}</p>
              <p className="text-sm text-muted-foreground">{friend.title}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {friend.status || "offline"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-primary" />
            <span>Lv. {friend.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Swords className="w-4 h-4 text-primary" />
            <span>{friend.stats.quizzesDone} trials</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
            <Swords className="w-4 h-4 mr-2" />
            Challenge
          </Button>
          <Button size="sm" variant="outline" onClick={() => onRemove(friend.uid)}>
            <UserMinus className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RequestCard({
  user,
  onAccept,
  onDecline,
}: {
  user: UserProfile
  onAccept: (uid: string) => void
  onDecline: (uid: string) => void
}) {
  return (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold">{user.username}</p>
            <p className="text-sm text-muted-foreground">Level {user.level}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1 ember-glow" onClick={() => onAccept(user.uid)}>
            Accept
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => onDecline(user.uid)}>
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
