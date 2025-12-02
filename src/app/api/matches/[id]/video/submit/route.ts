import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'JOBSEEKER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { videoUrl } = body

        if (!videoUrl || typeof videoUrl !== 'string') {
            return NextResponse.json({ error: 'Video URL is required' }, { status: 400 })
        }

        const { id } = await params

        // Verify match ownership
        const match = await prisma.match.findUnique({
            where: { id },
            include: {
                jobseeker: true
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        if (match.jobseeker.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Update match
        const updatedMatch = await prisma.match.update({
            where: { id },
            data: {
                videoSubmitted: true,
                videoUrl: videoUrl
            }
        })

        return NextResponse.json({ match: updatedMatch })
    } catch (error) {
        console.error('Error submitting video:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
