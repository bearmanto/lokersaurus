import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import './matches.css'

export default async function JobseekerMatchesPage() {
    const session = await auth()

    if (!session || session.user.role !== 'JOBSEEKER') {
        redirect('/login')
    }

    const profile = await prisma.jobseekerProfile.findUnique({
        where: { userId: session.user.id },
    })

    if (!profile) {
        redirect('/profile')
    }

    // Fetch all matches for this jobseeker
    const matches = await prisma.match.findMany({
        where: { jobseekerId: profile.id },
        include: {
            job: {
                include: {
                    company: true,
                },
            },
        },
        orderBy: [
            { score: 'desc' },
            { createdAt: 'desc' },
        ],
    })

    return (
        <div className="matches-page">
            <div className="container">
                <div className="page-header">
                    <h1>Your Matches</h1>
                    <p>Companies that are looking for someone like you</p>
                </div>

                {matches.length === 0 ? (
                    <Card className="empty-state">
                        <h3>No matches yet</h3>
                        <p>We'll notify you when companies post jobs that match your profile.</p>
                        <Link href="/profile">Update your profile to improve matches</Link>
                    </Card>
                ) : (
                    <div className="matches-grid">
                        {matches.map((match) => (
                            <Link href={`/matches/${match.id}`} key={match.id} className="match-card-link">
                                <Card className="match-card" hover>
                                    <div className="match-score">{match.score}% Match</div>

                                    <h3>{match.job.title}</h3>
                                    <p className="company-name">{match.job.company.name}</p>

                                    <div className="job-details">
                                        <span>{match.job.jobType?.replace('_', ' ')}</span>
                                        <span>•</span>
                                        <span>{match.job.remote}</span>
                                        {match.job.location && (
                                            <>
                                                <span>•</span>
                                                <span>{match.job.location}</span>
                                            </>
                                        )}
                                    </div>

                                    {match.job.minSalary && match.job.maxSalary && (
                                        <p className="salary">
                                            ${(match.job.minSalary / 1000).toFixed(0)}k - ${(match.job.maxSalary / 1000).toFixed(0)}k/year
                                        </p>
                                    )}

                                    <div className="match-status">
                                        {match.status === 'PENDING' && <span className="status-badge">New Match</span>}
                                        {match.status === 'INTERESTED' && <span className="status-badge interested">You're Interested</span>}
                                        {match.status === 'CONTACTED' && <span className="status-badge contacted">Company Contacted</span>}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
