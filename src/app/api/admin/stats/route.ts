import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const [
            totalUsers,
            totalJobs,
            activeJobs,
            totalMatches,
            recentUsers
        ] = await Promise.all([
            prisma.user.count(),
            prisma.job.count(),
            prisma.job.count({ where: { status: 'OPEN' } }),
            prisma.match.count(),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            })
        ])

        return NextResponse.json({
            stats: {
                totalUsers,
                totalJobs,
                activeJobs,
                totalMatches
            },
            recentUsers
        })
    } catch (error) {
        console.error('Error fetching admin stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
