import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get last 7 days
        const days = 7
        const today = new Date()
        const labels = []
        const userData = []
        const jobData = []

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            const nextDate = new Date(date)
            nextDate.setDate(date.getDate() + 1)

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))

            const [users, jobs] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextDate
                        }
                    }
                }),
                prisma.job.count({
                    where: {
                        createdAt: {
                            gte: date,
                            lt: nextDate
                        }
                    }
                })
            ])

            userData.push(users)
            jobData.push(jobs)
        }

        return NextResponse.json({
            labels,
            datasets: [
                {
                    label: 'New Users',
                    data: userData,
                    color: '#4F46E5'
                },
                {
                    label: 'New Jobs',
                    data: jobData,
                    color: '#10B981'
                }
            ]
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
