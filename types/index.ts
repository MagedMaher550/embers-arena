export interface UserProfile {
  uid: string
  username: string
  email: string
  avatar: string
  level: number
  xp: number
  embers: number
  gems: number
  title?: string
  activeTheme: string
  stats: {
    quizzesDone: number
    accuracy: number
    totalEmbersEarned: number
    wins: number
    losses: number
    streak: number
  }
  friends: string[]
  pendingSent: string[]
  pendingReceived: string[]
  inventory: {
    themes: string[]
    avatars: string[]
    titles: string[]
  }
  settings: {
    notifications: boolean
    soundEffects: boolean
    profileVisibility: "public" | "friends" | "private"
  }
  createdAt: any
  lastActive: any
}

export interface Quiz {
  id: string
  title: string
  description: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  emberReward: number
  xpReward: number
  requiredLevel: number
  questions: Question[]
}

export interface Question {
  question: string
  answers: string[]
  correctAnswer: number
  explanation: string
}

export interface ShopItem {
  id: string
  name: string
  description: string
  type: "theme" | "avatar" | "title"
  rarity: "common" | "rare" | "epic" | "legendary"
  price: number
  currency: "embers" | "gems"
  requiredLevel: number
  preview?: string
}


export interface Duel {
  id: string
  challengerId: string
  challengerName: string
  challengerAvatar: string
  opponentId: string
  opponentName: string
  opponentAvatar: string
  quizId: string
  quizTitle: string
  status: "pending" | "active" | "completed"
  wager: number
  challengerScore?: number
  opponentScore?: number
  winnerId?: string
  createdAt: any
}

export interface Friend {
  uid: string
  username: string
  avatar: string
  level: number
}