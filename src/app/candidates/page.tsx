import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import CandidateFilters from '@/components/candidates/CandidateFilters'
import './candidates.css'

export default async function CandidatesSearchPage({
    searchParams,
}: {
    searchParams: { skills?: string; experience?: string; remote?: string; minSalary?: string }
}) {
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

    // Build filter query
    const where: any = {
        isActive: true,
        profileComplete: true,
    }

    // Apply filters from search params
    // Note: This is basic filtering. In production, you'd want more sophisticated search

    const candidates = await prisma.jobseekerProfile.findMany({
        where,
        include: {
            user: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        take: 50, // Limit results
    })

    // Client-side filtering for JSON fields (skills, etc.)
    let filteredCandidates = candidates

    if (searchParams.skills) {
        const searchSkills = searchParams.skills.toLowerCase().split(',')
        filteredCandidates = filteredCandidates.filter(candidate => {
            if (!candidate.skills) return false
            const candidateSkills = JSON.parse(candidate.skills).map((s: string) => s.toLowerCase())
            return searchSkills.some(skill => candidateSkills.includes(skill.trim()))
        })
    }

    if (searchParams.remote) {
        filteredCandidates = filteredCandidates.filter(c => c.remote === searchParams.remote)
    }

    if (searchParams.minSalary) {
        const minSal = parseInt(searchParams.minSalary)
        filteredCandidates = filteredCandidates.filter(c => c.maxSalary && c.maxSalary >= minSal)
    }

    return (
        <div className="candidates-page">
            <div className="container">
                <div className="page-header">
                    <h1>Find Candidates</h1>
                    <p>Search our talent pool to find the perfect match for your team</p>
                </div>

                <CandidateFilters />

                <div className="results-count">
                    {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
                </div>

                {filteredCandidates.length === 0 ? (
                    <Card className="empty-state">
                        <h3>No candidates found</h3>
                        <p>Try adjusting your filters or check back later as more professionals join.</p>
                    </Card>
                ) : (
                    <div className="candidates-grid">
                        {filteredCandidates.map((candidate) => {
                            const skills = candidate.skills ? JSON.parse(candidate.skills) : []

                            // Blind Hiring Logic
                            // In a real app, we'd fetch matches to check status. 
                            // For MVP demo, we'll assume all are masked unless specific condition met
                            // Let's check if there's an accepted match
                            // Note: We need to fetch matches for this to work properly.
                            // For now, let's implement the visual masking first.

                            const isMasked = true // Default to masked for now to demonstrate feature
                            const displayName = isMasked ? `Candidate #${candidate.id.slice(-4)}` : candidate.user.name
                            const dinoAvatar = `https://api.dicebear.com/9.x/dylan/svg?seed=${candidate.id}`

                            return (
                                <Link href={`/candidates/${candidate.id}`} key={candidate.id} className="candidate-card-link">
                                    <Card className="candidate-card" hover>
                                        <div className="candidate-header">
                                            <div className="candidate-avatar-wrapper">
                                                <img
                                                    src={dinoAvatar}
                                                    alt="Candidate Avatar"
                                                    className="candidate-avatar"
                                                    width={64}
                                                    height={64}
                                                />
                                                {isMasked && <span className="blind-badge" title="Blind Hiring Mode">🦖</span>}
                                            </div>
                                            <div className="candidate-info">
                                                <h3>{displayName}</h3>
                                                {candidate.location && (
                                                    <p className="location">📍 {candidate.location}</p>
                                                )}
                                            </div>
                                        </div>

                                        {candidate.bio && (
                                            <p className="bio">{candidate.bio.substring(0, 120)}{candidate.bio.length > 120 ? '...' : ''}</p>
                                        )}

                                        {skills.length > 0 && (
                                            <div className="skills-preview">
                                                {skills.slice(0, 6).map((skill: string, index: number) => (
                                                    <span key={index} className="skill-tag">{skill}</span>
                                                ))}
                                                {skills.length > 6 && <span className="more-skills">+{skills.length - 6} more</span>}
                                            </div>
                                        )}

                                        <div className="candidate-meta">
                                            {candidate.jobType && <span>{candidate.jobType.replace('_', ' ')}</span>}
                                            {candidate.remote && (
                                                <>
                                                    <span>•</span>
                                                    <span>{candidate.remote}</span>
                                                </>
                                            )}
                                            {candidate.minSalary && candidate.maxSalary && (
                                                <>
                                                    <span>•</span>
                                                    <span>${(candidate.minSalary / 1000).toFixed(0)}k-${(candidate.maxSalary / 1000).toFixed(0)}k</span>
                                                </>
                                            )}
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
