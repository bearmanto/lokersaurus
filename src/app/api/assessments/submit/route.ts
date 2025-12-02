import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'JOBSEEKER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { assessmentId, score, passed } = body

        const result = await prisma.userAssessment.create({
            data: {
                userId: session.user.id,
                assessmentId,
                score,
                passed
            }
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error submitting quiz:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
