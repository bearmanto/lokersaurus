'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface Question {
    id: string
    text: string
    options: string // JSON string
    correctOption: number
}

interface Assessment {
    id: string
    title: string
    passingScore: number
    questions: Question[]
}

export default function QuizInterface({ assessment, userId }: { assessment: Assessment, userId: string }) {
    const router = useRouter()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [score, setScore] = useState<number | null>(null)
    const [passed, setPassed] = useState(false)

    const currentQuestion = assessment.questions[currentQuestionIndex]
    const options = JSON.parse(currentQuestion.options) as string[]

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers]
        newAnswers[currentQuestionIndex] = optionIndex
        setAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestionIndex < assessment.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            submitQuiz()
        }
    }

    const submitQuiz = async () => {
        setIsSubmitting(true)

        // Calculate score locally for immediate feedback (in a real app, do this server-side only)
        let correctCount = 0
        assessment.questions.forEach((q, i) => {
            if (answers[i] === q.correctOption) correctCount++
        })

        const finalScore = Math.round((correctCount / assessment.questions.length) * 100)
        const isPassed = finalScore >= assessment.passingScore

        try {
            await fetch('/api/assessments/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assessmentId: assessment.id,
                    score: finalScore,
                    passed: isPassed
                })
            })

            setScore(finalScore)
            setPassed(isPassed)
        } catch (error) {
            console.error('Failed to submit quiz', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (score !== null) {
        return (
            <Card className="text-center p-12">
                <div className="text-6xl mb-6">{passed ? '🎉' : '😢'}</div>
                <h2 className="text-3xl font-serif mb-4">{passed ? 'Assessment Passed!' : 'Assessment Failed'}</h2>
                <p className="text-xl mb-8">
                    You scored <span className={`font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
                </p>
                <p className="text-gray-600 mb-8">
                    {passed
                        ? 'Congratulations! A "Verified" badge has been added to your profile.'
                        : 'Don\'t worry, you can try again later to earn your badge.'}
                </p>
                <Button onClick={() => router.push('/assessments')}>
                    Back to Assessments
                </Button>
            </Card>
        )
    }

    return (
        <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-500">{assessment.title}</h2>
                <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1} of {assessment.questions.length}
                </span>
            </div>

            <div className="mb-8">
                <h3 className="text-2xl font-serif mb-6">{currentQuestion.text}</h3>
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestionIndex] === index
                                    ? 'border-primary bg-primary-light text-primary font-medium'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleNext}
                    disabled={answers[currentQuestionIndex] === undefined || isSubmitting}
                >
                    {currentQuestionIndex === assessment.questions.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit Quiz') : 'Next Question'}
                </Button>
            </div>
        </Card>
    )
}
