import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import QuizInterface from '@/components/assessments/QuizInterface'
import '../assessments.css'

export default async function QuizPage({ params }: { params: { slug: string } }) {
    const session = await auth()

    if (!session || session.user.role !== 'JOBSEEKER') {
        redirect('/login')
    }

    const assessment = await prisma.assessment.findUnique({
        where: { slug: params.slug },
        include: {
            questions: true,
            userResults: {
                where: { userId: session.user.id }
            }
        }
    })

    if (!assessment) {
        return <div>Assessment not found</div>
    }

    // If already passed, redirect to list
    if (assessment.userResults.some(r => r.passed)) {
        redirect('/assessments')
    }

    return (
        <div className="assessments-page">
            <div className="container max-w-2xl mx-auto">
                <QuizInterface
                    assessment={assessment}
                    userId={session.user.id}
                />
            </div>
        </div>
    )
}
