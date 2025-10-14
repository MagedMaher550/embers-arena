"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { db } from "@/lib/firebase/config"
import { doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Swords, Flame, Clock } from "lucide-react"
import { quizzes } from "@/lib/quiz-data"

interface DuelData {
  challengerId: string
  challengerName: string
  challengerAvatar: string
  opponentId: string
  opponentName: string
  opponentAvatar: string
  quizId: string
  quizTitle: string
  status: string
  wager: number
  challengerScore?: number
  opponentScore?: number
  winnerId?: string
}

export default function DuelSessionPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [duel, setDuel] = useState<DuelData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isAnswered, setIsAnswered] = useState(false)
  const [loading, setLoading] = useState(true)

  const quiz = quizzes.find((q) => q.id === duel?.quizId)
  const questions = quiz?.questions || []
  const question = questions[currentQuestion]

  useEffect(() => {
    loadDuel()
  }, [id])

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered) {
      handleNext()
    }
  }, [timeLeft, isAnswered])

  const loadDuel = async () => {
    try {
      const duelDoc = await getDoc(doc(db, "duels", id as string))
      if (duelDoc.exists()) {
        setDuel(duelDoc.data() as DuelData)
      }
    } catch (error) {
      console.error("Error loading duel:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setTimeLeft(60)
    } else {
      completeDuel()
    }
  }

  const completeDuel = async () => {
    if (!user || !duel) return

    try {
      const isChallenger = user.uid === duel.challengerId
      const updateData: any = {
        [isChallenger ? "challengerScore" : "opponentScore"]: score,
      }

      // Check if both players have completed
      const duelDoc = await getDoc(doc(db, "duels", id as string))
      const duelData = duelDoc.data()

      if (isChallenger && duelData?.opponentScore !== undefined) {
        // Both completed, determine winner
        const winnerId = score > duelData.opponentScore ? user.uid : duel.opponentId
        updateData.status = "completed"
        updateData.winnerId = winnerId

        // Award embers to winner
        const winnerQuery = await getDoc(doc(db, "users", winnerId))
        if (winnerQuery.exists()) {
          await updateDoc(doc(db, "users", winnerId), {
            embers: increment(duel.wager * 2),
          })
        }
      } else if (!isChallenger && duelData?.challengerScore !== undefined) {
        // Both completed, determine winner
        const winnerId = score > duelData.challengerScore ? user.uid : duel.challengerId
        updateData.status = "completed"
        updateData.winnerId = winnerId

        // Award embers to winner
        const winnerQuery = await getDoc(doc(db, "users", winnerId))
        if (winnerQuery.exists()) {
          await updateDoc(doc(db, "users", winnerId), {
            embers: increment(duel.wager * 2),
          })
        }
      }

      await updateDoc(doc(db, "duels", id as string), updateData)
      router.push("/duels")
    } catch (error) {
      console.error("Error completing duel:", error)
    }
  }

  if (loading || !duel || !question) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Flame className="w-12 h-12 text-accent animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading duel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container max-w-3xl mx-auto px-4 py-6">
        {/* Duel Header */}
        <Card className="p-4 mb-6 bg-card/50 border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{duel.challengerAvatar}</div>
              <div>
                <p className="font-semibold text-sm">{duel.challengerName}</p>
                <p className="text-xs text-muted-foreground">
                  {duel.challengerScore !== undefined ? `${duel.challengerScore} pts` : "In progress"}
                </p>
              </div>
            </div>
            <Swords className="w-6 h-6 text-accent" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-sm">{duel.opponentName}</p>
                <p className="text-xs text-muted-foreground">
                  {duel.opponentScore !== undefined ? `${duel.opponentScore} pts` : "In progress"}
                </p>
              </div>
              <div className="text-2xl">{duel.opponentAvatar}</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-accent/30">
              Wager: {duel.wager} <Flame className="w-3 h-3 ml-1 text-accent" />
            </Badge>
          </div>
        </Card>

        {/* Question Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className={`text-sm font-semibold ${timeLeft < 10 ? "text-accent" : "text-foreground"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-6 mb-6 bg-card/50 border-accent/20">
          <h2 className="text-xl font-bold mb-6 text-balance">{question.question}</h2>
          <div className="space-y-3">
            {question.answers.map((answer, index) => {
              const isCorrect = index === question.correctAnswer
              const isSelected = selectedAnswer === index
              const showResult = isAnswered

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showResult && isCorrect
                      ? "bg-green-500/20 border-green-500/50"
                      : showResult && isSelected && !isCorrect
                        ? "bg-red-500/20 border-red-500/50"
                        : isSelected
                          ? "bg-accent/20 border-accent"
                          : "bg-background border-accent/20 hover:border-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        showResult && isCorrect
                          ? "border-green-500 bg-green-500/20"
                          : showResult && isSelected && !isCorrect
                            ? "border-red-500 bg-red-500/20"
                            : "border-accent/30"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{answer}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Explanation & Next */}
        {isAnswered && (
          <Card className="p-4 mb-6 bg-accent/10 border-accent/30">
            <p className="text-sm text-muted-foreground mb-2">Explanation:</p>
            <p className="text-sm">{question.explanation}</p>
          </Card>
        )}

        {isAnswered && (
          <Button onClick={handleNext} className="w-full bg-accent hover:bg-accent/90">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Duel"}
          </Button>
        )}

        {/* Current Score */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Your Score</p>
          <p className="text-3xl font-bold text-accent">
            {score}/{questions.length}
          </p>
        </div>
      </div>
    </div>
  )
}
