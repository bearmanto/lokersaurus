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
        const search = searchParams.get('search') || ''

        const skip = (page - 1) * limit

        const where: any = {}

        if (status !== 'ALL') {
            where.status = status
        }

        if (search) {
            where.OR = [
                { title: { contains: search } }, // SQLite/Postgres handling
                { company: { name: { contains: search } } }
            ]
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    company: {
                        select: {
                            name: true,
                            logo: true
                        }
                    },
                    _count: {
                        select: {
                            matches: true,
                            applications: true
                        }
                    }
                }
            }),
            prisma.job.count({ where })
        ])

        return NextResponse.json({
            jobs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        })
    } catch (error) {
        console.error('Error fetching jobs:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { jobId, status } = body

        if (!jobId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Validate status transition if needed, but for Admin we allow force updates
        const allowedStatuses = ['DRAFT', 'ACTIVE', 'CLOSED', 'REJECTED']
        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: { status },
            include: {
                company: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json({ job: updatedJob })
    } catch (error) {
        console.error('Error updating job:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
