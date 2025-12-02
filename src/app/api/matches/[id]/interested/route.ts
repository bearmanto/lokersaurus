import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'JOBSEEKER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const profile = await prisma.jobseekerProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        // Update match status
        const match = await prisma.match.update({
            where: {
                id: params.id,
                jobseekerId: profile.id,
            },
            data: {
                status: 'INTERESTED',
                interestedAt: new Date(),
            },
        })

        // TODO: Send notification to HR

        return NextResponse.json({ success: true, match })
    } catch (error) {
        console.error('Error marking interest:', error)
        return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
    }
}
