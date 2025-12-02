import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['JOBSEEKER', 'HR', 'ADMIN']),
    companyName: z.string().optional(),
})

// Profile validation schemas
export const jobseekerProfileSchema = z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
    resumeUrl: z.string().url().optional().or(z.literal('')),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
})

export const companyProfileSchema = z.object({
    name: z.string().min(2, 'Company name is required'),
    description: z.string().max(1000).optional(),
    industry: z.string().optional(),
    size: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    logo: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
})

// Job validation schema
export const jobSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    requirements: z.string().optional(),
    responsibilities: z.string().optional(),
    salaryMin: z.number().min(0).optional(),
    salaryMax: z.number().min(0).optional(),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']),
    experienceLevel: z.enum(['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
    location: z.string().optional(),
    isRemote: z.boolean().default(false),
    deadline: z.string().optional(), // Will be converted to Date
})

// Application validation schema
export const applicationSchema = z.object({
    jobId: z.string(),
    coverLetter: z.string().max(1000).optional(),
    resumeUrl: z.string().url().optional().or(z.literal('')),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type JobseekerProfileInput = z.infer<typeof jobseekerProfileSchema>
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>
export type JobInput = z.infer<typeof jobSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
