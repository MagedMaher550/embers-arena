import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "./config"

export interface UserProfile {
  uid: string
  username: string
  email: string
  level: number
  embers: number
  streakDays: number
  lastLogin: Date
  avatar: string
  title: string
  equippedTheme: string
  stats: {
    quizzesDone: number
    accuracy: number
    totalEmbersEarned: number
  }
  privacy: {
    allowFriendRequests: boolean
    showLoreToFriends: boolean
    publicLeaderboard: boolean
  }
}

export async function signUp(email: string, password: string, username: string, avatar = "warrior") {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Create user profile in Firestore
  const userProfile: UserProfile = {
    uid: user.uid,
    username,
    email,
    level: 1,
    embers: 20,
    streakDays: 0,
    lastLogin: new Date(),
    avatar,
    title: "Novice",
    equippedTheme: "pixel-dark-fantasy",
    stats: {
      quizzesDone: 0,
      accuracy: 0,
      totalEmbersEarned: 0,
    },
    privacy: {
      allowFriendRequests: true,
      showLoreToFriends: true,
      publicLeaderboard: true,
    },
  }

  await setDoc(doc(db, "users", user.uid), userProfile)
  return { user, userProfile }
}

export async function signIn(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password)
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  const user = result.user

  // Check if user profile exists
  const userDoc = await getDoc(doc(db, "users", user.uid))
  if (!userDoc.exists()) {
    // Create profile for new Google user
    const userProfile: UserProfile = {
      uid: user.uid,
      username: user.displayName || "Warrior",
      email: user.email || "",
      level: 1,
      embers: 20,
      streakDays: 0,
      lastLogin: new Date(),
      avatar: "warrior",
      title: "Novice",
      equippedTheme: "pixel-dark-fantasy",
      stats: {
        quizzesDone: 0,
        accuracy: 0,
        totalEmbersEarned: 0,
      },
      privacy: {
        allowFriendRequests: true,
        showLoreToFriends: true,
        publicLeaderboard: true,
      },
    }
    await setDoc(doc(db, "users", user.uid), userProfile)
  }

  return result
}

export async function signOut() {
  return await firebaseSignOut(auth)
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, "users", uid))
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile
  }
  return null
}
