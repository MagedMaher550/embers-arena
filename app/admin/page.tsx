"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Plus, Edit, Trash2, Users, BookOpen, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface Quiz {
  id: string
  title: string
  category: string
  difficulty: string
  questions: any[]
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalDuels: 0,
  })

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  const checkAdminAccess = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      const userQuery = query(collection(db, "users"), where("uid", "==", user.uid))
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data()
        if (userData.role === "admin") {
          setIsAdmin(true)
          loadAdminData()
        } else {
          router.push("/realm")
        }
      }
    } catch (error) {
      console.error("Error checking admin access:", error)
      router.push("/realm")
    } finally {
      setLoading(false)
    }
  }

  const loadAdminData = async () => {
    try {
      // Load stats
      const usersSnapshot = await getDocs(collection(db, "users"))
      const quizzesSnapshot = await getDocs(collection(db, "quizzes"))
      const duelsSnapshot = await getDocs(collection(db, "duels"))

      setStats({
        totalUsers: usersSnapshot.size,
        totalQuizzes: quizzesSnapshot.size,
        totalDuels: duelsSnapshot.size,
      })

      // Load quizzes
      const quizzesData = quizzesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quiz[]
      setQuizzes(quizzesData)
    } catch (error) {
      console.error("Error loading admin data:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-accent animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-card/50 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-10 h-10 text-accent/50" />
            </div>
          </Card>
          <Card className="p-6 bg-card/50 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Quizzes</p>
                <p className="text-3xl font-bold">{stats.totalQuizzes}</p>
              </div>
              <BookOpen className="w-10 h-10 text-accent/50" />
            </div>
          </Card>
          <Card className="p-6 bg-card/50 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Duels</p>
                <p className="text-3xl font-bold">{stats.totalDuels}</p>
              </div>
              <Trophy className="w-10 h-10 text-accent/50" />
            </div>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs defaultValue="quizzes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50">
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Quizzes</h2>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Quiz
              </Button>
            </div>
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-4 bg-card/50 border-accent/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{quiz.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-accent/30">
                          {quiz.category}
                        </Badge>
                        <Badge variant="outline" className="border-accent/30">
                          {quiz.difficulty}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{quiz.questions?.length || 0} questions</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <Card className="p-8 text-center bg-card/50 border-accent/20">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">User management coming soon</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">System Settings</h2>
            <Card className="p-8 text-center bg-card/50 border-accent/20">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">System settings coming soon</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
