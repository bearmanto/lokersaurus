import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import './assessments.css'

export default async function AssessmentsPage() {
    const session = await auth()

    if (!session || session.user.role !== 'JOBSEEKER') {
        redirect('/login')
    }

    const assessments = await prisma.assessment.findMany({
        include: {
            userResults: {
                where: { userId: session.user.id }
            }
        }
    })

    return (
        <div className="assessments-page">
            <div className="container">
                <div className="page-header text-center mb-12">
                    <h1 className="text-4xl font-serif mb-4">Skill Assessments</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Prove your expertise and earn "Verified" badges to stand out to top employers.
                    </p>
                </div>

                <div className="assessments-grid">
                    {assessments.map((assessment) => {
                        const result = assessment.userResults[0]
                        const isPassed = result?.passed

                        return (
                            <Card key={assessment.id} className="assessment-card hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`icon-wrapper ${assessment.icon}`}>
                                        {/* Simple icon placeholder based on slug */}
                                        <span className="text-2xl">
                                            {assessment.icon === 'react' ? '⚛️' :
                                                assessment.icon === 'node' ? '🟢' :
                                                    assessment.icon === 'design' ? '🎨' : '📝'}
                                        </span>
                                    </div>
                                    {isPassed && (
                                        <span className="badge-verified">
                                            ✓ Verified
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2">{assessment.title}</h3>
                                <p className="text-gray-600 mb-6 text-sm line-clamp-2">
                                    {assessment.description}
                                </p>

                                {isPassed ? (
                                    <div className="w-full py-2 text-center bg-green-50 text-green-700 rounded-lg font-medium border border-green-100">
                                        Passed ({result.score}%)
                                    </div>
                                ) : (
                                    <Link href={`/assessments/${assessment.slug}`} className="block">
                                        <button className="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                            Take Quiz
                                        </button>
                                    </Link>
                                )}
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
