"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Lock, BookOpen, Scroll } from "lucide-react"

const loreEntries = [
  {
    id: "lore-1",
    title: "The Founding of Ember Arena",
    preview: "In the age of forgotten knowledge, the Ember Arena was forged...",
    cost: 0,
    unlocked: true,
    content:
      "In the age of forgotten knowledge, the Ember Arena was forged from the ashes of the Great Library. The ancient scholars, seeking to preserve wisdom for eternity, created trials of fire and shadow where warriors could prove their intellect and earn fragments of power known as embers.",
  },
  {
    id: "lore-2",
    title: "The Legend of the First Champion",
    preview: "Before the arena fell silent, there was one who conquered all...",
    cost: 50,
    unlocked: false,
    content:
      "Before the arena fell silent, there was one who conquered all trials. Known only as the First Champion, this legendary warrior earned so many embers that they transcended mortality itself, becoming one with the eternal flame that powers the arena.",
  },
  {
    id: "lore-3",
    title: "The Ember Forge",
    preview: "Deep beneath the arena lies the source of all power...",
    cost: 100,
    unlocked: false,
    content:
      "Deep beneath the arena lies the Ember Forge, an ancient furnace that burns with knowledge itself. It is said that those who collect enough embers can access the forge and unlock powers beyond imagination.",
  },
  {
    id: "lore-4",
    title: "The Hall of Eternity",
    preview: "Only the greatest warriors have their names inscribed...",
    cost: 150,
    unlocked: false,
    content:
      "Only the greatest warriors have their names inscribed in the Hall of Eternity. This mystical chamber exists outside of time, where legends gather to share their wisdom and challenge each other for all eternity.",
  },
]

export default function LorePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Lore of the Arena</h1>
            <p className="text-muted-foreground">Uncover the secrets of Ember Arena</p>
          </div>

          {/* Lore Timeline */}
          <div className="space-y-4">
            {loreEntries.map((entry, index) => (
              <Card
                key={entry.id}
                className={`${entry.unlocked ? "border-primary/30" : "opacity-75"} transition-all hover:border-primary/50`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        {entry.unlocked ? (
                          <BookOpen className="w-5 h-5 text-primary" />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                          {entry.unlocked && <Badge className="bg-green-500/20 text-green-500">Unlocked</Badge>}
                        </div>
                        <CardDescription className="leading-relaxed">{entry.preview}</CardDescription>
                      </div>
                    </div>
                    {!entry.unlocked && entry.cost > 0 && (
                      <div className="flex items-center gap-1 text-primary shrink-0">
                        <Flame className="w-4 h-4" />
                        <span className="font-bold">{entry.cost}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {entry.unlocked && (
                  <CardContent>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{entry.content}</p>
                    </div>
                  </CardContent>
                )}

                {!entry.unlocked && (
                  <CardContent>
                    <Button className="w-full" disabled={entry.cost === 0}>
                      <Flame className="w-4 h-4 mr-2" />
                      Unlock for {entry.cost} Embers
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Completion Card */}
          <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardContent className="p-6 text-center">
              <Scroll className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Lore Collection</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock all entries to reveal the complete history of Ember Arena
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="text-2xl font-bold text-primary">1/4</div>
                <span className="text-muted-foreground">Entries Unlocked</span>
              </div>
            </CardContent>
          </Card>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}
