"use client";

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Flame, Bell, User, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/firebase/auth";

export function HeaderHUD() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const emberPercentage = userProfile
    ? Math.min((userProfile.embers / (userProfile.level * 100)) * 100, 100)
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <Link href="/realm" className="flex items-center gap-2 shrink-0">
              <Flame className="w-6 h-6 md:w-7 md:h-7 text-primary" />
              <span className="hidden sm:block font-bold text-lg">
                EMBER ARENA
              </span>
            </Link>

            {userProfile && (
              <div className="hidden md:flex items-center gap-3 min-w-0">
                <div className="flex flex-col min-w-0">
                  <p className="font-bold text-sm truncate">
                    {userProfile.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Level {userProfile.level}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Ember bar */}
          {userProfile && (
            <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xs">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-bold">
                    {userProfile.embers}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ember-glow"
                    style={{ width: `${emberPercentage}%` }}
                  />
                </div>
              </div>

              {userProfile.streakDays > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-lg shrink-0">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-xs font-bold">
                    {userProfile.streakDays}d
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:flex"
              disabled={!userProfile}
            >
              <Bell className="w-5 h-5" />
              {userProfile && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>

            {/* Desktop Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:flex">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* change to userProfiles later */}
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => router.push("/login")}>
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-4 py-2 space-y-1">
              {userProfile ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => router.push("/settings")}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
