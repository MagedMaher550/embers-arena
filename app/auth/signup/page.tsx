"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp, signInWithGoogle } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmberParticles } from "@/components/ember-particles"
import { Flame, Mail, Sword, Shield, Wand2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const avatars = [
  { id: "warrior", name: "Warrior", icon: Sword },
  { id: "guardian", name: "Guardian", icon: Shield },
  { id: "mage", name: "Mage", icon: Wand2 },
]

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("warrior")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password, username, selectedAvatar)
      toast({
        title: "Welcome to Ember Arena!",
        description: "Your journey begins now.",
      })
      router.push("/realm")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account"
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Welcome to Ember Arena!",
        description: "Your journey begins now.",
      })
      router.push("/realm")
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google"
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center p-4">
      <EmberParticles />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Flame className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">EMBER ARENA</h1>
          </Link>
          <p className="text-muted-foreground">Create your warrior profile</p>
        </div>

        {/* Signup Form */}
        <div className="parchment p-6 md:p-8 rounded-lg space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Warrior Name</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your warrior name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="warrior@emberarena.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background"
              />
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <Label>Choose Your Class</Label>
              <div className="grid grid-cols-3 gap-3">
                {avatars.map((avatar) => {
                  const Icon = avatar.icon
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedAvatar === avatar.id
                          ? "border-primary bg-primary/10 ember-glow"
                          : "border-border bg-background hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-xs font-medium">{avatar.name}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button type="submit" className="w-full ember-glow" disabled={loading}>
              {loading ? "Creating account..." : "Begin Your Journey"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleGoogleSignIn} disabled={loading}>
            <Mail className="w-4 h-4 mr-2" />
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
