import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status') || 'ALL'

        const skip = (page - 1) * limit

        const where: any = {}

        if (status !== 'ALL') {
            where.status = status
        }

        const [matches, total] = await Promise.all([
            prisma.match.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    job: {
                        select: {
                            title: true,
                            company: {
                                select: { name: true }
                            }
                        }
                    },
                    jobseeker: {
                        include: {
                            user: {
                                select: { name: true, email: true }
                            }
                        }
                    }
                }
            }),
            prisma.match.count({ where })
        ])

        return NextResponse.json({
            matches,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        })
    } catch (error) {
        console.error('Error fetching matches:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
