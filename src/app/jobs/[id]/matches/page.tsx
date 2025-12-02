import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import VideoRequestAction from '@/components/video/VideoRequestAction'
import './job-matches.css'

export default async function JobMatchesPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session || session.user.role !== 'HR') {
        redirect('/login')
    }

    const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
    })

    if (!company) {
        redirect('/profile/company')
    }

    // Fetch job with matches
    const job = await prisma.job.findUnique({
        where: { id: params.id, companyId: company.id },
        include: {
            matches: {
                include: {
                    jobseeker: {
                        include: {
                            user: true,
                        },
                    },
                },
                orderBy: [
                    { score: 'desc' },
                    { createdAt: 'desc' },
                ],
            },
        },
    })

    if (!job) {
        notFound()
    }

    return (
        <div className="job-matches-page">
            <div className="container">
                <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>

                <div className="page-header">
                    <h1>Candidates for {job.title}</h1>
                    <p>{job.matches.length} matched candidates</p>
                </div>

                {job.matches.length === 0 ? (
                    <Card className="empty-state">
                        <h3>No matches yet</h3>
                        <p>We'll find candidates as more jobseekers join the platform with matching skills.</p>
                    </Card>
                ) : (
                    <div className="candidates-grid">
                        {job.matches.map((match) => {
                            const profile = match.jobseeker
                            const skills = profile.skills ? JSON.parse(profile.skills) : []

                            return (
                                <Link href={`/candidates/${profile.id}`} key={match.id} className="candidate-card-link">
                                    <Card className="candidate-card" hover>
                                        <div className="match-score">{match.score}% Match</div>

                                        <h3>{profile.user.name || 'Anonymous'}</h3>

                                        {profile.location && (
                                            <p className="location">📍 {profile.location}</p>
                                        )}

                                        {profile.bio && (
                                            <p className="bio">{profile.bio.substring(0, 120)}{profile.bio.length > 120 ? '...' : ''}</p>
                                        )}

                                        {skills.length > 0 && (
                                            <div className="skills-preview">
                                                {skills.slice(0, 5).map((skill: string, index: number) => (
                                                    <span key={index} className="skill-tag">{skill}</span>
                                                ))}
                                                {skills.length > 5 && <span className="more-skills">+{skills.length - 5} more</span>}
                                            </div>
                                        )}

                                        <div className="candidate-status">
                                            {match.status === 'PENDING' && <span className="status-badge">New</span>}
                                            {match.status === 'INTERESTED' && <span className="status-badge interested">Interested</span>}
                                            {match.status === 'CONTACTED' && <span className="status-badge contacted">Contacted</span>}

                                            <Link href={`/messages/${match.id}`} className="message-btn-link">
                                                <Button variant="outline" size="sm">
                                                    Message
                                                </Button>
                                            </Link>
                                        </div>

                                        <div style={{ marginTop: 'var(--spacing-md)' }}>
                                            <VideoRequestAction
                                                matchId={match.id}
                                                videoRequested={match.videoRequested}
                                                videoSubmitted={match.videoSubmitted}
                                                videoUrl={match.videoUrl}
                                            />
                                        </div>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
