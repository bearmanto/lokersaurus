import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const userId = session.user.id
        const userRole = session.user.role

        // Find matches that have been initiated/contacted
        // For HR: Matches where they are the job owner
        // For Jobseeker: Matches where they are the candidate

        let matches

        if (userRole === 'HR') {
            const company = await prisma.company.findUnique({
                where: { userId },
            })

            if (!company) {
                return NextResponse.json({ error: 'Company profile not found' }, { status: 404 })
            }

            matches = await prisma.match.findMany({
                where: {
                    job: {
                        companyId: company.id
                    },
                    // Only show matches that have some engagement or are high quality
                    OR: [
                        { status: 'CONTACTED' },
                        { status: 'INTERESTED' },
                        { status: 'PROGRESSED' },
                        // Also include matches with messages even if status is pending (edge case)
                        {
                            job: {
                                company: {
                                    userId: userId
                                }
                            }
                        }
                    ]
                },
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                        }
                    },
                    jobseeker: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            })
        } else {
            // Jobseeker
            const profile = await prisma.jobseekerProfile.findUnique({
                where: { userId },
            })

            if (!profile) {
                return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
            }

            matches = await prisma.match.findMany({
                where: {
                    jobseekerId: profile.id,
                    OR: [
                        { status: 'CONTACTED' },
                        { status: 'INTERESTED' }, // If they expressed interest, they should see it
                        { status: 'PROGRESSED' }
                    ]
                },
                include: {
                    job: {
                        include: {
                            company: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            })
        }

        // Transform matches into conversation objects
        // In a real app, we'd fetch the last message for each match here
        const conversations = await Promise.all(matches.map(async (match) => {
            // Get last message
            const lastMessage = await prisma.message.findFirst({
                where: {
                    matchId: match.id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            // Determine the "other person"
            let otherUser: any
            if (userRole === 'HR') {
                // TypeScript narrowing: HR matches include jobseeker
                const hrMatch: any = match
                otherUser = {
                    id: hrMatch.jobseeker.user.id,
                    name: hrMatch.jobseeker.user.name,
                    image: hrMatch.jobseeker.user.image,
                    title: 'Candidate'
                }
            } else {
                // Jobseeker matches include job.company.user
                const jsMatch: any = match
                otherUser = {
                    id: jsMatch.job.company.user.id,
                    name: jsMatch.job.company.name,
                    image: jsMatch.job.company.logo,
                    title: jsMatch.job.company.name
                }
            }

            return {
                id: match.id, // Conversation ID is the Match ID
                otherUser,
                jobTitle: match.job.title,
                lastMessage: lastMessage ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    isRead: lastMessage.read
                } : null,
                status: match.status,
                updatedAt: match.updatedAt
            }
        }))

        // Filter out conversations with no messages if status is just PENDING/INTERESTED?
        // For now, keep them so they can start the chat

        return NextResponse.json({ conversations })
    } catch (error) {
        console.error('Error fetching conversations:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
