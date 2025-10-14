"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { HeaderHUD } from "@/components/header-hud"
import { BottomNav } from "@/components/bottom-nav"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, Target } from "lucide-react"
import { sampleQuizzes } from "@/lib/quiz-data"
import Link from "next/link"

const difficultyColors = {
  easy: "bg-green-500/20 text-green-500 border-green-500/50",
  medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  hard: "bg-orange-500/20 text-orange-500 border-orange-500/50",
  legendary: "bg-purple-500/20 text-purple-500 border-purple-500/50",
}

export default function TrialsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pb-20 md:pb-8">
        <EmberParticles />
        <HeaderHUD />

        <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">Knowledge Trials</h1>
            <p className="text-muted-foreground">Test your wisdom and earn embers</p>
          </div>

          {/* Difficulty Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
              <TabsTrigger value="legendary">Legend</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="easy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleQuizzes
                  .filter((q) => q.difficulty === "easy")
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="medium" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleQuizzes
                  .filter((q) => q.difficulty === "medium")
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="hard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleQuizzes
                  .filter((q) => q.difficulty === "hard")
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="legendary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleQuizzes
                  .filter((q) => q.difficulty === "legendary")
                  .map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        <BottomNav />
      </div>
    </ProtectedRoute>
  )
}

function QuizCard({ quiz }: { quiz: any }) {
  return (
    <Card className="group hover:border-primary/50 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge className={difficultyColors[quiz.difficulty as keyof typeof difficultyColors]}>
            {quiz.difficulty.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1 text-primary">
            <Flame className="w-4 h-4" />
            <span className="font-bold text-sm">+{quiz.reward}</span>
          </div>
        </div>
        <CardTitle className="text-lg">{quiz.title}</CardTitle>
        <CardDescription>{quiz.category}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{quiz.minDurationSeconds}s min</span>
          </div>
        </div>
        <Button className="w-full group-hover:ember-glow" asChild>
          <Link href={`/trials/${quiz.id}`}>Begin Trial</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
