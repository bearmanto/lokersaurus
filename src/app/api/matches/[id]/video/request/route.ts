```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'HR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify match ownership
        const match = await prisma.match.findUnique({
            where: { id: params.id },
            include: {
                job: {
                    include: {
                        company: true
                    }
                }
            }
        })

        if (!match) {
            return NextResponse.json({ error: 'Match not found' }, { status: 404 })
        }

        if (match.job.company.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Update match
        const updatedMatch = await prisma.match.update({
            where: { id: params.id },
            data: {
                videoRequested: true,
                // Also ensure status is at least CONTACTED if they are requesting video
                status: match.status === 'PENDING' || match.status === 'INTERESTED' ? 'CONTACTED' : match.status,
                contactedAt: match.contactedAt || new Date()
            }
        })

        return NextResponse.json({ match: updatedMatch })
    } catch (error) {
        console.error('Error requesting video:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
