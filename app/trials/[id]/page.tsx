"use client"

import { use, useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { EmberParticles } from "@/components/ember-particles"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { getQuizById } from "@/lib/quiz-data"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { doc, updateDoc, increment, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useToast } from "@/hooks/use-toast"

export default function TrialSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const quiz = getQuizById(resolvedParams.id)
  const router = useRouter()
  const { userProfile, user } = useAuth()
  const { toast } = useToast()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [startTime] = useState(Date.now())
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (quizComplete) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestion, quizComplete])

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Trial not found</p>
          <Button onClick={() => router.push("/trials")}>Back to Trials</Button>
        </div>
      </div>
    )
  }

  const handleTimeUp = () => {
    if (selectedAnswer === null) {
      handleAnswer(-1)
    }
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    setAnswers([...answers, answerIndex])
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(60)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    const correctAnswers = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length
    const finalScore = correctAnswers
    const accuracy = (correctAnswers / quiz.questions.length) * 100

    setScore(finalScore)
    setQuizComplete(true)

    // Check minimum duration
    if (duration < quiz.minDurationSeconds) {
      toast({
        title: "Trial too fast",
        description: `Minimum duration is ${quiz.minDurationSeconds} seconds. No rewards granted.`,
        variant: "destructive",
      })
      return
    }

    // Award embers and update stats
    if (user && userProfile) {
      try {
        const earnedEmbers = Math.floor((quiz.reward * correctAnswers) / quiz.questions.length)

        await updateDoc(doc(db, "users", user.uid), {
          embers: increment(earnedEmbers),
          "stats.quizzesDone": increment(1),
          "stats.totalEmbersEarned": increment(earnedEmbers),
          "stats.accuracy":
            (userProfile.stats.accuracy * userProfile.stats.quizzesDone + accuracy) /
            (userProfile.stats.quizzesDone + 1),
        })

        // Create session record
        await setDoc(doc(db, "users", user.uid, "sessions", `${Date.now()}`), {
          quizId: quiz.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          score: finalScore,
          questionsAnswered: quiz.questions.length,
          valid: true,
          earnedEmbers,
        })

        toast({
          title: "Trial Complete!",
          description: `You earned ${earnedEmbers} embers!`,
        })
      } catch (error) {
        console.error("Error updating user stats:", error)
      }
    }
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  if (quizComplete) {
    const correctAnswers = answers.filter((answer, index) => answer === quiz.questions[index].correctAnswer).length
    const earnedEmbers = Math.floor((quiz.reward * correctAnswers) / quiz.questions.length)

    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <EmberParticles />

          <Card className="relative z-10 max-w-2xl w-full parchment">
            <CardContent className="p-6 md:p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto ember-glow-strong">
                <Flame className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold">Trial Complete!</h2>
                <p className="text-muted-foreground">You have proven your knowledge</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {correctAnswers}/{quiz.questions.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Correct Answers</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">+{earnedEmbers}</p>
                  <p className="text-sm text-muted-foreground mt-1">Embers Earned</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" onClick={() => router.push("/trials")}>
                  Back to Trials
                </Button>
                <Button className="flex-1 ember-glow" onClick={() => router.push("/realm")}>
                  Return to Hub
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4">
        <EmberParticles />

        <div className="relative z-10 max-w-4xl mx-auto py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.push("/trials")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg">{timeLeft}s</span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <Badge variant="outline">{quiz.difficulty}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="parchment">
            <CardContent className="p-6 md:p-8 space-y-6">
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-balance">{question.question}</h2>

              <div className="grid grid-cols-1 gap-3">
                {question.choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === question.correctAnswer
                  const showResult = showExplanation

                  return (
                    <button
                      key={index}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        showResult
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : isSelected
                              ? "border-red-500 bg-red-500/10"
                              : "border-border bg-card"
                          : isSelected
                            ? "border-primary bg-primary/10 ember-glow"
                            : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex-1">{choice}</span>
                        {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="font-bold text-sm text-primary">Explanation</p>
                  <p className="text-sm leading-relaxed">{question.explanation}</p>
                </div>
              )}

              {showExplanation && (
                <Button className="w-full ember-glow" onClick={handleNext}>
                  {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Complete Trial"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
