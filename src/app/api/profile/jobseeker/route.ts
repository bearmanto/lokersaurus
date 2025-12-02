import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session || session.user.role !== 'JOBSEEKER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()

        // Stringify JSON fields
        const profileData = {
            bio: data.bio || null,
            location: data.location || null,
            phone: data.phone || null,
            skills: data.skills ? JSON.stringify(data.skills) : null,
            experience: data.experience ? JSON.stringify(data.experience) : null,
            education: data.education ? JSON.stringify(data.education) : null,
            resumeUrl: data.resumeUrl || null,
            portfolioUrl: data.portfolioUrl || null,
            jobType: data.jobType || null,
            remote: data.remote || null,
            minSalary: data.minSalary ? parseInt(data.minSalary) : null,
            maxSalary: data.maxSalary ? parseInt(data.maxSalary) : null,
            currency: 'USD',
            availability: data.availability || null,
            isActive: data.isActive ?? true,
            profileComplete: checkProfileComplete(data),
        }

        // Upsert profile
        const profile = await prisma.jobseekerProfile.upsert({
            where: { userId: session.user.id },
            update: profileData,
            create: {
                ...profileData,
                userId: session.user.id,
            },
        })

        return NextResponse.json({ success: true, profile })
    } catch (error) {
        console.error('Profile save error:', error)
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
    }
}

function checkProfileComplete(data: any): boolean {
    // Profile is considered complete if it has:
    // - Bio
    // - Location
    // - At least 3 skills
    // - At least 1 experience entry
    // - Job preferences (type, remote, salary)

    const hasBasicInfo = data.bio && data.location
    const hasSkills = data.skills && data.skills.length >= 3
    const hasExperience = data.experience && data.experience.length >= 1
    const hasPreferences = data.jobType && data.remote && data.minSalary

    return !!(hasBasicInfo && hasSkills && hasExperience && hasPreferences)
}
