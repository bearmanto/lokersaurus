import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify participant
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                job: {
                    include: {
                        company: true
                    }
                },
                jobseeker: true
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        // Check if user is part of this match
        const isParticipant =
            (session.user.role === 'HR' && match.job.company.userId === session.user.id) ||
            (session.user.role === 'JOBSEEKER' && match.jobseeker.userId === session.user.id)

        if (!isParticipant) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Fetch messages
        const messages = await prisma.message.findMany({
            where: {
                matchId: id
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { content, type = 'TEXT', metadata } = body

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        const { id } = await params

        // Verify participant and get recipient
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                job: {
                    include: {
                        company: true
                    }
                },
                jobseeker: true
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        let recipientId
        if (session.user.role === 'HR') {
            if (match.job.company.userId !== session.user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
            }
            recipientId = match.jobseeker.userId
        } else {
            if (match.jobseeker.userId !== session.user.id) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
            }
            recipientId = match.job.company.userId
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                content,
                type,
                metadata: metadata ? JSON.stringify(metadata) : null,
                senderId: session.user.id,
                recipientId,
                matchId: id,
                jobId: match.jobId,
                read: false
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        })

        // Update match status if needed
        if (session.user.role === 'HR' && (match.status === 'PENDING' || match.status === 'INTERESTED')) {
            await prisma.match.update({
                where: { id: match.id },
                data: {
                    status: 'CONTACTED',
                    contactedAt: new Date()
                }
            })
        }

        return NextResponse.json({ message })
    } catch (error) {
        console.error('Error sending message:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
