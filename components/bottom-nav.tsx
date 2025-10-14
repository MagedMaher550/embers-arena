"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Swords, ShoppingBag, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/realm", icon: Home, label: "Hub" },
  { href: "/trials", icon: Swords, label: "Trials" },
  { href: "/duels", icon: Swords, label: "Duels" },
  { href: "/market", icon: ShoppingBag, label: "Market" },
  { href: "/friends", icon: Users, label: "Friends" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
