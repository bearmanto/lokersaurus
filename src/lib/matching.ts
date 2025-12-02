import { prisma } from './prisma'

/**
 * Auto-matching algorithm
 * Finds and creates matches between a job and active jobseeker profiles
 */
export async function runMatching(jobId: string) {
    // Fetch the job with company details
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true },
    })

    if (!job) throw new Error('Job not found')

    // Fetch all active jobseeker profiles
    const jobseekers = await prisma.jobseekerProfile.findMany({
        where: {
            isActive: true,
            profileComplete: true,
        },
    })

    const matches = []

    for (const jobseeker of jobseekers) {
        const score = calculateMatchScore(job, jobseeker)

        // Only create match if score is above threshold (60%)
        if (score >= 60) {
            const match = await prisma.match.create({
                data: {
                    jobId: job.id,
                    jobseekerId: jobseeker.id,
                    score,
                    initiatedBy: 'SYSTEM',
                    status: 'PENDING',
                },
            })
            matches.push(match)
        }
    }

    return matches
}

/**
 * Calculate match score between a job and jobseeker profile
 * Score is 0-100 based on multiple criteria
 */
function calculateMatchScore(job: any, profile: any): number {
    let score = 0

    // 1. Skills Match (40% weight)
    const jobSkills = job.requiredSkills ? JSON.parse(job.requiredSkills) : []
    const profileSkills = profile.skills ? JSON.parse(profile.skills) : []

    if (jobSkills.length > 0 && profileSkills.length > 0) {
        const matchedSkills = jobSkills.filter((skill: string) =>
            profileSkills.some((ps: string) => ps.toLowerCase() === skill.toLowerCase())
        )
        const skillMatchPercent = matchedSkills.length / jobSkills.length
        score += skillMatchPercent * 40
    }

    // 2. Experience Level Match (20% weight)
    if (job.experienceLevel && profile.experience) {
        const profileExp = JSON.parse(profile.experience)
        const yearsOfExp = calculateYearsOfExperience(profileExp)

        const expMatch = matchExperienceLevel(job.experienceLevel, yearsOfExp)
        if (expMatch) {
            score += 20
        } else if (yearsOfExp > getMinYearsForLevel(job.experienceLevel)) {
            // Partial credit if overqualified
            score += 10
        }
    }

    // 3. Remote/Work Style Match (15% weight)
    if (job.remote && profile.remote) {
        if (job.remote === profile.remote ||
            job.remote === 'HYBRID' ||
            profile.remote === 'HYBRID') {
            score += 15
        }
    }

    // 4. Job Type Match (10% weight)
    if (job.jobType === profile.jobType) {
        score += 10
    }

    // 5. Salary Compatibility (15% weight)
    if (job.minSalary && job.maxSalary && profile.minSalary && profile.maxSalary) {
        // Check if salary ranges overlap
        if (!(job.maxSalary < profile.minSalary || job.minSalary > profile.maxSalary)) {
            score += 15
        } else if (Math.abs(job.minSalary - profile.minSalary) <= 10000) {
            // Close enough (within $10k)
            score += 7
        }
    }

    return Math.min(Math.round(score), 100)
}

/**
 * Calculate total years of experience from work history
 */
function calculateYearsOfExperience(experience: any[]): number {
    if (!Array.isArray(experience)) return 0

    let totalMonths = 0
    const now = new Date()

    for (const exp of experience) {
        if (!exp.startDate) continue

        const start = new Date(exp.startDate + '-01')
        const end = exp.current ? now : new Date(exp.endDate + '-01')

        const months = (end.getFullYear() - start.getFullYear()) * 12 +
            (end.getMonth() - start.getMonth())
        totalMonths += months
    }

    return totalMonths / 12
}

/**
 * Check if years of experience matches the required level
 */
function matchExperienceLevel(level: string, years: number): boolean {
    switch (level) {
        case 'ENTRY':
            return years >= 0 && years <= 2
        case 'MID':
            return years >= 2 && years <= 5
        case 'SENIOR':
            return years >= 5 && years <= 10
        case 'LEAD':
            return years >= 8
        default:
            return false
    }
}

/**
 * Get minimum years required for an experience level
 */
function getMinYearsForLevel(level: string): number {
    switch (level) {
        case 'ENTRY': return 0
        case 'MID': return 2
        case 'SENIOR': return 5
        case 'LEAD': return 8
        default: return 0
    }
}
