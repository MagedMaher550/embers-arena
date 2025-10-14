"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flame, Palette, User, Crown, Zap, Lock, ShoppingCart } from "lucide-react"
import { shopItems, rarityColors, type ShopItem } from "@/lib/shop-data"
import { useAuth } from "@/contexts/auth-context"
import { doc, updateDoc, increment, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useToast } from "@/hooks/use-toast"

const categoryIcons = {
  theme: Palette,
  avatar: User,
  title: Crown,
  boost: Zap,
}

export default function MarketPage() {
  const { userProfile, user } = useAuth()
  const { toast } = useToast()
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async (item: ShopItem) => {
    if (!user || !userProfile) return

    // Check if user has enough embers
    if (userProfile.embers < item.cost) {
      toast({
        title: "Insufficient embers",
        description: `You need ${item.cost - userProfile.embers} more embers.`,
        variant: "destructive",
      })
      return
    }

    // Check level requirement
    if (item.unlockLevel && userProfile.level < item.unlockLevel) {
      toast({
        title: "Level requirement not met",
        description: `You need to reach level ${item.unlockLevel}.`,
        variant: "destructive",
      })
      return
    }

    setPurchasing(true)

    try {
      // Deduct embers
      await updateDoc(doc(db, "users", user.uid), {
        embers: increment(-item.cost),
      })

      // Add to inventory
      await setDoc(doc(db, "users", user.uid, "inventory", item.id), {
        itemId: item.id,
        ownedSince: new Date(),
        equipped: false,
      })

      // Create transaction record
      await setDoc(doc(db, "users", user.uid, "transactions", `${Date.now()}`), {
        type: "spend",
        amount: item.cost,
        source: "shop_purchase",
        itemId: item.id,
        timestamp: new Date(),
      })

      toast({
        title: "Purchase successful!",
        description: `${item.name} has been added to your inventory.`,
      })

      setSelectedItem(null)
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  if (!userProfile) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Ember Market</h1>
            <p className="text-muted-foreground">Unlock powerful items and customizations</p>
          </div>

          {/* Balance Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
                  <div className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-primary" />
                    <span className="text-3xl font-bold">{userProfile.embers}</span>
                    <span className="text-muted-foreground">Embers</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Level</p>
                  <p className="text-2xl font-bold">{userProfile.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="theme">Themes</TabsTrigger>
              <TabsTrigger value="avatar">Avatars</TabsTrigger>
              <TabsTrigger value="title">Titles</TabsTrigger>
              <TabsTrigger value="boost">Boosts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.map((item) => (
                  <ShopItemCard key={item.id} item={item} userLevel={userProfile.level} onSelect={setSelectedItem} />
                ))}
              </div>
            </TabsContent>

            {["theme", "avatar", "title", "boost"].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shopItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <ShopItemCard
                        key={item.id}
                        item={item}
                        userLevel={userProfile.level}
                        onSelect={setSelectedItem}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>

        <BottomNav />

        {/* Purchase Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-md">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedItem.name}
                    <Badge className={rarityColors[selectedItem.rarity]}>{selectedItem.rarity}</Badge>
                  </DialogTitle>
                  <DialogDescription>{selectedItem.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Preview */}
                  <div className="w-full h-32 bg-muted/50 rounded-lg flex items-center justify-center">
                    {(() => {
                      const Icon = categoryIcons[selectedItem.category]
                      return <Icon className="w-16 h-16 text-primary" />
                    })()}
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">Cost</span>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary" />
                        <span className="font-bold">{selectedItem.cost}</span>
                      </div>
                    </div>

                    {selectedItem.unlockLevel && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Required Level</span>
                        <span className="font-bold">{selectedItem.unlockLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <Button
                    className="w-full ember-glow"
                    onClick={() => handlePurchase(selectedItem)}
                    disabled={
                      purchasing ||
                      userProfile.embers < selectedItem.cost ||
                      (selectedItem.unlockLevel !== undefined && userProfile.level < selectedItem.unlockLevel)
                    }
                  >
                    {purchasing ? (
                      "Processing..."
                    ) : userProfile.embers < selectedItem.cost ? (
                      "Insufficient Embers"
                    ) : selectedItem.unlockLevel && userProfile.level < selectedItem.unlockLevel ? (
                      `Requires Level ${selectedItem.unlockLevel}`
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Purchase
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

function ShopItemCard({
  item,
  userLevel,
  onSelect,
}: {
  item: ShopItem
  userLevel: number
  onSelect: (item: ShopItem) => void
}) {
  const Icon = categoryIcons[item.category]
  const isLocked = item.unlockLevel !== undefined && userLevel < item.unlockLevel

  return (
    <Card className={`group transition-all ${isLocked ? "opacity-60" : "hover:border-primary/50 hover:shadow-lg"}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={rarityColors[item.rarity]}>{item.rarity}</Badge>
          <div className="flex items-center gap-1 text-primary">
            <Flame className="w-4 h-4" />
            <span className="font-bold text-sm">{item.cost}</span>
          </div>
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          {item.name}
          {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
        </CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="w-full h-24 bg-muted/50 rounded-lg flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary" />
        </div>

        {isLocked && (
          <div className="text-xs text-muted-foreground text-center">Unlocks at Level {item.unlockLevel}</div>
        )}

        <Button
          className={`w-full ${!isLocked && "group-hover:ember-glow"}`}
          onClick={() => onSelect(item)}
          disabled={isLocked}
        >
          {isLocked ? `Level ${item.unlockLevel} Required` : "View Details"}
        </Button>
      </CardContent>
    </Card>
  )
}
