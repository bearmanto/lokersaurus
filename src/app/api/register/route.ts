import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validatedData = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hash(validatedData.password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                role: validatedData.role,
            },
        })

        // If HR role, create company profile
        if (validatedData.role === 'HR' && validatedData.companyName) {
            await prisma.company.create({
                data: {
                    userId: user.id,
                    name: validatedData.companyName,
                },
            })
        }

        // If JOBSEEKER role, create jobseeker profile
        if (validatedData.role === 'JOBSEEKER') {
            await prisma.jobseekerProfile.create({
                data: {
                    userId: user.id,
                },
            })
        }

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Registration error:', error)

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )
    }
}
