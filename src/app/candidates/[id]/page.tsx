import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import '../candidates.css'

export default async function CandidateDetailPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session || session.user.role !== 'HR') {
        redirect('/login')
    }

    const candidate = await prisma.jobseekerProfile.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            matches: {
                where: {
                    job: {
                        company: {
                            userId: session.user.id
                        }
                    }
                }
            }
        }
    })

    if (!candidate) {
        return <div className="p-8 text-center">Candidate not found</div>
    }

    // Blind Hiring Logic
    // Check if there is any match with status INTERESTED or CONTACTED
    const isUnlocked = candidate.matches.some(m => ['INTERESTED', 'CONTACTED'].includes(m.status))

    // Masked Data
    const displayName = isUnlocked ? candidate.user.name : `Candidate #${candidate.id.slice(-4)}`
    const dinoAvatar = `https://api.dicebear.com/9.x/dylan/svg?seed=${candidate.id}`
    const email = isUnlocked ? candidate.user.email : 'Hidden until unlocked'

    const skills = candidate.skills ? JSON.parse(candidate.skills) : []
    const experience = candidate.experience ? JSON.parse(candidate.experience) : []
    const education = candidate.education ? JSON.parse(candidate.education) : []

    // Fetch HR's active jobs for salary comparison
    const activeJobs = await prisma.job.findMany({
        where: {
            company: { userId: session.user.id },
            status: 'ACTIVE'
        },
        select: {
            id: true,
            title: true,
            minSalary: true,
            maxSalary: true,
            currency: true
        }
    })

    // Helper to calculate budget fit
    const getBudgetFit = (job: any) => {
        if (!candidate.minSalary || !job.maxSalary) return { status: 'UNKNOWN', label: 'Unknown' }

        // If candidate's minimum is within job's max budget
        if (candidate.minSalary <= job.maxSalary) {
            return { status: 'MATCH', label: 'Budget Match', color: 'bg-green-100 text-green-800' }
        }

        // If candidate's minimum is slightly above (within 20%)
        if (candidate.minSalary <= job.maxSalary * 1.2) {
            return { status: 'NEGOTIABLE', label: 'Negotiable', color: 'bg-yellow-100 text-yellow-800' }
        }

        return { status: 'HIGH', label: 'High Expectation', color: 'bg-red-100 text-red-800' }
    }

    return (
        <div className="candidate-detail-page candidates-page">
            <div className="container max-w-4xl mx-auto">
                <Link href="/candidates" className="back-link mb-6 inline-block text-gray-500 hover:text-primary">
                    ← Back to Candidates
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="candidate-header-card p-8">
                            <div className="flex items-start gap-6">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={dinoAvatar}
                                        alt="Avatar"
                                        className="w-full h-full rounded-full border-4 border-white shadow-md bg-gray-50"
                                    />
                                    {!isUnlocked && (
                                        <span className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100 text-xl" title="Blind Mode Active">
                                            🦖
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-serif mb-2">{displayName}</h1>
                                    <div className="flex flex-wrap gap-3 text-gray-600 text-sm mb-4">
                                        {candidate.location && <span>📍 {candidate.location}</span>}
                                        {candidate.jobType && <span>💼 {candidate.jobType.replace('_', ' ')}</span>}
                                        {candidate.remote && <span>🏠 {candidate.remote}</span>}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{candidate.bio}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h2 className="text-xl font-serif mb-6">Experience</h2>
                            <div className="space-y-8">
                                {experience.map((exp: any, i: number) => (
                                    <div key={i} className="relative pl-6 border-l-2 border-gray-100 last:border-0">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-200 border-4 border-white"></div>
                                        <h3 className="font-bold text-lg">{exp.title}</h3>
                                        <p className="text-gray-600 mb-2">
                                            {/* Mask Company Name if Blind Mode? Optional. For now, let's show it. */}
                                            {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
                                        </p>
                                        <p className="text-gray-500 text-sm">{exp.description}</p>
                                    </div>
                                ))}
                                {experience.length === 0 && <p className="text-gray-400 italic">No experience listed</p>}
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h2 className="text-xl font-serif mb-6">Education</h2>
                            <div className="space-y-6">
                                {education.map((edu: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="font-bold">{edu.school}</h3>
                                        <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                                        <p className="text-gray-400 text-sm">{edu.graduationYear}</p>
                                    </div>
                                ))}
                                {education.length === 0 && <p className="text-gray-400 italic">No education listed</p>}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4">Match Status</h3>

                            {isUnlocked ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
                                    <div className="text-2xl mb-2">🔓</div>
                                    <h4 className="font-bold text-green-800">Profile Unlocked</h4>
                                    <p className="text-green-600 text-sm mb-3">You can now view full details and contact this candidate.</p>
                                    <div className="text-sm font-mono bg-white p-2 rounded border border-green-100 select-all">
                                        {email}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
                                    <div className="text-2xl mb-2">🔒</div>
                                    <h4 className="font-bold text-gray-800">Blind Profile</h4>
                                    <p className="text-gray-600 text-sm">Request a match to unlock full details and contact info.</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {!isUnlocked ? (
                                    <Button full size="lg">Request to Unlock</Button>
                                ) : (
                                    <Button full size="lg" variant="outline">Send Message</Button>
                                )}

                                <div className="border-t border-gray-100 my-4 pt-4">
                                    <h4 className="font-bold text-sm mb-3 text-gray-900">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 my-4 pt-4">
                                    <h4 className="font-bold text-sm mb-3 text-gray-900">Preferences</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Salary:</span>
                                            <span className="font-medium text-gray-900">
                                                ${candidate.minSalary ? (candidate.minSalary / 1000).toFixed(0) : '0'}k - ${candidate.maxSalary ? (candidate.maxSalary / 1000).toFixed(0) : '0'}k
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Remote:</span>
                                            <span className="font-medium text-gray-900">{candidate.remote}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Budget Fit Section */}
                                {activeJobs.length > 0 && (
                                    <div className="border-t border-gray-100 my-4 pt-4">
                                        <h4 className="font-bold text-sm mb-3 text-gray-900">Budget Fit (Private)</h4>
                                        <div className="space-y-2">
                                            {activeJobs.map(job => {
                                                const fit = getBudgetFit(job)
                                                return (
                                                    <div key={job.id} className="flex items-center justify-between text-sm">
                                                        <span className="truncate max-w-[120px]" title={job.title}>{job.title}</span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${fit.color}`}>
                                                            {fit.label}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
