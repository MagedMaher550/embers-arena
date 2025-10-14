import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  level: number;
  embers: number;
  streakDays: number;
  lastLogin: Date;
  avatar: string;
  title: string;
  equippedTheme: string;
  stats: {
    quizzesDone: number;
    accuracy: number;
    totalEmbersEarned: number;
  };
  privacy: {
    allowFriendRequests: boolean;
    showLoreToFriends: boolean;
    publicLeaderboard: boolean;
  };
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  avatar = "warrior"
) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

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
  };

  await setDoc(doc(db, "users", user.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
  });

  return { user, userProfile };
}

export async function signIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  // Auto-create missing user profile
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const userProfile: UserProfile = {
      uid: user.uid,
      username: user.email?.split("@")[0] || "Warrior",
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
    };
    await setDoc(ref, { ...userProfile, createdAt: serverTimestamp() });
  }

  return result;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
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
    };

    await setDoc(ref, { ...userProfile, createdAt: serverTimestamp() });
  }

  return result;
}

export async function signOut() {
  return await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  return null;
}
