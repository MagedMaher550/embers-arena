"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Palette, User, Crown, Zap, Package } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { getItemById, rarityColors, type ShopItem } from "@/lib/shop-data"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const categoryIcons = {
  theme: Palette,
  avatar: User,
  title: Crown,
  boost: Zap,
}

export default function InventoryPage() {
  const { userProfile, user } = useAuth()
  const { toast } = useToast()
  const [inventory, setInventory] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadInventory()
    }
  }, [user])

  const loadInventory = async () => {
    if (!user) return

    try {
      const inventoryRef = collection(db, "users", user.uid, "inventory")
      const snapshot = await getDocs(inventoryRef)
      const items = snapshot.docs
        .map((doc) => {
          const item = getItemById(doc.data().itemId)
          return item
        })
        .filter((item): item is ShopItem => item !== undefined)

      setInventory(items)
    } catch (error) {
      console.error("Error loading inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEquip = async (item: ShopItem) => {
    if (!user) return

    try {
      // Update user profile based on item type
      if (item.category === "theme") {
        await updateDoc(doc(db, "users", user.uid), {
          equippedTheme: item.id.replace("theme-", ""),
        })
      } else if (item.category === "title") {
        await updateDoc(doc(db, "users", user.uid), {
          title: item.name,
        })
      } else if (item.category === "avatar") {
        await updateDoc(doc(db, "users", user.uid), {
          avatar: item.id.replace("avatar-", ""),
        })
      }

      toast({
        title: "Item equipped!",
        description: `${item.name} is now active.`,
      })
    } catch (error) {
      console.error("Error equipping item:", error)
      toast({
        title: "Failed to equip item",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!userProfile) return null

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading inventory...</p>
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
            <h1 className="text-2xl md:text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Manage your collected items</p>
          </div>

          {inventory.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center space-y-4">
                <Package className="w-16 h-16 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Your inventory is empty</h3>
                  <p className="text-muted-foreground">Visit the market to purchase items</p>
                </div>
                <Button asChild>
                  <Link href="/market">Browse Market</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="all">All ({inventory.length})</TabsTrigger>
                <TabsTrigger value="theme">Themes</TabsTrigger>
                <TabsTrigger value="avatar">Avatars</TabsTrigger>
                <TabsTrigger value="title">Titles</TabsTrigger>
                <TabsTrigger value="boost">Boosts</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((item) => (
                    <InventoryItemCard key={item.id} item={item} onEquip={handleEquip} />
                  ))}
                </div>
              </TabsContent>

              {["theme", "avatar", "title", "boost"].map((category) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <InventoryItemCard key={item.id} item={item} onEquip={handleEquip} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}

function InventoryItemCard({ item, onEquip }: { item: ShopItem; onEquip: (item: ShopItem) => void }) {
  const Icon = categoryIcons[item.category]

  return (
    <Card className="group hover:border-primary/50 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={rarityColors[item.rarity]}>{item.rarity}</Badge>
        </div>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="w-full h-24 bg-muted/50 rounded-lg flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary" />
        </div>

        {item.category !== "boost" && (
          <Button className="w-full group-hover:ember-glow" onClick={() => onEquip(item)}>
            Equip
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
