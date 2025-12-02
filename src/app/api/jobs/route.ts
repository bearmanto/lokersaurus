import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { runMatching } from '@/lib/matching'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'HR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        // Validate company exists
        const company = await prisma.company.findUnique({
            where: { id: data.companyId, userId: session.user.id },
        })

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 })
        }

        // Create job
        const job = await prisma.job.create({
            data: {
                companyId: data.companyId,
                title: data.title,
                description: data.description,
                location: data.location || null,
                requiredSkills: data.requiredSkills ? JSON.stringify(data.requiredSkills) : null,
                experienceLevel: data.experienceLevel || null,
                jobType: data.jobType,
                remote: data.remote,
                minSalary: data.minSalary ? parseInt(data.minSalary) : null,
                maxSalary: data.maxSalary ? parseInt(data.maxSalary) : null,
                currency: 'USD',
                status: 'ACTIVE', // Auto-publish
            },
        })

        // Run matching algorithm for this job
        const matches = await runMatching(job.id)

        return NextResponse.json({
            success: true,
            job,
            matchCount: matches.length
        })
    } catch (error) {
        console.error('Job creation error:', error)
        return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
    }
}
