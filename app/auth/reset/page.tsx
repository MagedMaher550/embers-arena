"use client"

import type React from "react"

import { useState } from "react"
import { resetPassword } from "@/lib/firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmberParticles } from "@/components/ember-particles"
import { Flame, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await resetPassword(email)
      setSent(true)
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email"
      toast({
        title: "Reset failed",
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
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {/* Reset Form */}
        <div className="parchment p-6 md:p-8 rounded-lg space-y-6">
          {!sent ? (
            <>
              <form onSubmit={handleReset} className="space-y-4">
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

                <Button type="submit" className="w-full ember-glow" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto ember-glow">
                <Flame className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Check your email</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've sent password reset instructions to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>
              <Link href="/auth/login">
                <Button className="w-full">Return to Sign In</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
