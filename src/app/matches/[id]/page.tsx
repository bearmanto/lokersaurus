import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import InterestedButton from '@/components/matches/InterestedButton'
import VideoSubmission from '@/components/video/VideoSubmission'
import './match-detail.css'
import '@/components/video/video.css'

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
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

    const match = await prisma.match.findUnique({
        where: { id: params.id },
        include: {
            job: {
                include: {
                    company: true,
                },
            },
        },
    })

    if (!match || match.jobseekerId !== profile.id) {
        notFound()
    }

    // Mark as viewed by jobseeker
    if (!match.viewedByJobseeker) {
        await prisma.match.update({
            where: { id: match.id },
            data: { viewedByJobseeker: true },
        })
    }

    // Parse skills
    const requiredSkills = match.job.requiredSkills ? JSON.parse(match.job.requiredSkills) : []

    return (
        <div className="match-detail-page">
            <div className="container">
                <Link href="/matches" className="back-link">← Back to Matches</Link>

                <div className="match-detail-grid">
                    <div className="main-content">
                        <Card className="job-header">
                            <div className="match-score-large">{match.score}% Match</div>
                            <h1>{match.job.title}</h1>
                            <p className="company-name">{match.job.company.name}</p>

                            <div className="job-meta">
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
                                <p className="salary-range">
                                    ${(match.job.minSalary / 1000).toFixed(0)}k - ${(match.job.maxSalary / 1000).toFixed(0)}k/year
                                </p>
                            )}
                        </Card>

                        <Card className="job-description">
                            <h2>About the Role</h2>
                            <p className="description-text">{match.job.description}</p>
                        </Card>

                        {requiredSkills.length > 0 && (
                            <Card className="job-skills">
                                <h2>Required Skills</h2>
                                <div className="skills-list">
                                    {requiredSkills.map((skill: string, index: number) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="sidebar">
                        <div className="action-card">
                            <h3>Interested?</h3>
                            <p>Let the company know you're interested in this role.</p>
                            <InterestedButton matchId={match.id} currentStatus={match.status} />

                            {(match.status === 'CONTACTED' || match.status === 'INTERESTED') && (
                                <Link href={`/messages/${match.id}`} style={{ display: 'block', marginTop: 'var(--spacing-md)', textDecoration: 'none' }}>
                                    <Button variant="outline" size="lg" full>
                                        Send Message
                                    </Button>
                                </Link>
                            )}

                            <VideoSubmission
                                matchId={match.id}
                                videoRequested={match.videoRequested}
                                videoSubmitted={match.videoSubmitted}
                                videoUrl={match.videoUrl}
                            />
                        </div>

                        {match.job.company.website && (
                            <Card className="company-card">
                                <h3>About {match.job.company.name}</h3>
                                {match.job.company.description && (
                                    <p>{match.job.company.description}</p>
                                )}
                                <a href={match.job.company.website} target="_blank" rel="noopener noreferrer" className="company-link">
                                    Visit website →
                                </a>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
