"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { EmberParticles } from "@/components/ember-particles";
import { Flame, Swords, Trophy, Users } from "lucide-react";

export default function LandingPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showLore, setShowLore] = useState(false);

  // Redirect logged-in users after auth & profile are fully loaded
  useEffect(() => {
    if (!loading && user) {
      router.push("/realm");
    }
  }, [user, loading, router]);

  // Show loader while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page only for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <EmberParticles />

        {/* Header */}
        <header className="relative z-10 px-4 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              EMBER ARENA
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/auth/login")}>
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 px-4 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/20 rounded-full flex items-center justify-center ember-glow-strong">
                  <Flame className="w-12 h-12 md:w-16 md:h-16 text-primary animate-pulse" />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="block text-balance">Forge Your Legend</span>
                <span className="block text-primary text-balance">
                  In The Arena
                </span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
                Battle through knowledge trials, duel friends, and rise through
                the ranks in this pixel-art dark fantasy quiz RPG.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={() => router.push("/auth/signup")}
                className="w-full sm:w-auto ember-glow text-base md:text-lg px-8 py-6"
              >
                <Flame className="w-5 h-5 mr-2" />
                Enter the Realm
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowLore(true)}
                className="w-full sm:w-auto text-base md:text-lg px-8 py-6"
              >
                Discover the Lore
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
              <div className="parchment p-6 rounded-lg space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Swords className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Epic Battles</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Challenge yourself with knowledge trials and duel friends in
                  real-time quiz battles.
                </p>
              </div>

              <div className="parchment p-6 rounded-lg space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Level Up</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Earn embers, unlock themes, and climb the leaderboard to
                  become a legend.
                </p>
              </div>

              <div className="parchment p-6 rounded-lg space-y-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Build Alliances</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connect with warriors, track friend activity, and compete
                  together.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Lore Modal */}
        {showLore && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLore(false)}
          >
            <div
              className="parchment max-w-2xl w-full p-6 md:p-8 rounded-lg space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-primary">
                The Legend of Ember Arena
              </h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  In the age of forgotten knowledge, the Ember Arena was forged
                  from the ashes of the Great Library. Here, warriors test their
                  wisdom in trials of fire and shadow.
                </p>
                <p>
                  Those who prove their worth earn embers—fragments of ancient
                  power that fuel their ascension. With each victory, legends
                  are born and the strongest rise to claim their place in the
                  Hall of Eternity.
                </p>
                <p className="text-primary font-semibold">
                  Will you answer the call?
                </p>
              </div>
              <Button onClick={() => setShowLore(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <p className="text-xs text-muted-foreground tracking-widest">
            SCROLL TO REVEAL
          </p>
        </div>
      </div>
    );
  }

  return null; // logged-in users are redirected
}
