export interface ShopItem {
  id: string
  name: string
  category: "theme" | "avatar" | "title" | "boost"
  cost: number
  rarity: "common" | "rare" | "epic" | "legendary"
  description: string
  preview?: string
  unlockLevel?: number
}

export const shopItems: ShopItem[] = [
  // Themes
  {
    id: "theme-frost",
    name: "Frost Theme",
    category: "theme",
    cost: 100,
    rarity: "rare",
    description: "A cool blue theme with icy accents and frost particles",
    unlockLevel: 5,
  },
  {
    id: "theme-infernal",
    name: "Infernal Theme",
    category: "theme",
    cost: 150,
    rarity: "epic",
    description: "A fiery red theme with blazing effects and hellfire ambiance",
    unlockLevel: 10,
  },
  {
    id: "theme-celestial",
    name: "Celestial Theme",
    category: "theme",
    cost: 200,
    rarity: "legendary",
    description: "A divine golden theme with heavenly light and star particles",
    unlockLevel: 15,
  },

  // Avatars
  {
    id: "avatar-knight",
    name: "Knight Avatar",
    category: "avatar",
    cost: 50,
    rarity: "common",
    description: "A noble knight in shining armor",
  },
  {
    id: "avatar-assassin",
    name: "Assassin Avatar",
    category: "avatar",
    cost: 75,
    rarity: "rare",
    description: "A stealthy shadow warrior",
    unlockLevel: 5,
  },
  {
    id: "avatar-dragon",
    name: "Dragon Avatar",
    category: "avatar",
    cost: 150,
    rarity: "legendary",
    description: "Transform into a mighty dragon",
    unlockLevel: 20,
  },

  // Titles
  {
    id: "title-scholar",
    name: "Scholar",
    category: "title",
    cost: 30,
    rarity: "common",
    description: "Display your dedication to knowledge",
  },
  {
    id: "title-champion",
    name: "Champion",
    category: "title",
    cost: 60,
    rarity: "rare",
    description: "Show your prowess in battle",
    unlockLevel: 8,
  },
  {
    id: "title-legend",
    name: "Legend",
    category: "title",
    cost: 120,
    rarity: "epic",
    description: "Become a living legend",
    unlockLevel: 15,
  },
  {
    id: "title-immortal",
    name: "Immortal",
    category: "title",
    cost: 200,
    rarity: "legendary",
    description: "Achieve immortality in the arena",
    unlockLevel: 25,
  },

  // Boosts
  {
    id: "boost-xp-2x",
    name: "2x XP Boost",
    category: "boost",
    cost: 40,
    rarity: "common",
    description: "Double XP for 1 hour",
  },
  {
    id: "boost-ember-2x",
    name: "2x Ember Boost",
    category: "boost",
    cost: 50,
    rarity: "rare",
    description: "Double ember rewards for 1 hour",
  },
  {
    id: "boost-combo",
    name: "Mega Boost",
    category: "boost",
    cost: 80,
    rarity: "epic",
    description: "2x XP and Embers for 2 hours",
  },
]

export const rarityColors = {
  common: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  rare: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  epic: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  legendary: "bg-amber-500/20 text-amber-400 border-amber-500/50",
}

export function getItemsByCategory(category: string): ShopItem[] {
  return shopItems.filter((item) => item.category === category)
}

export function getItemById(id: string): ShopItem | undefined {
  return shopItems.find((item) => item.id === id)
}
