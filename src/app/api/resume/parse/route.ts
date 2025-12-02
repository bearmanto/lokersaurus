import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Mock AI Extraction Logic
        // In a real app, we would send the file to an OCR/LLM service here.
        // For MVP, we return realistic mock data.

        const mockData = {
            bio: "Passionate Full Stack Developer with 4+ years of experience building scalable web applications. Proficient in the MERN stack and cloud technologies. Strong problem-solver with a focus on user experience and performance optimization.",
            skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS", "AWS", "Docker"],
            experience: [
                {
                    title: "Senior Frontend Engineer",
                    company: "TechCorp Indonesia",
                    startDate: "2022-01",
                    endDate: "", // Present
                    description: "Led the migration of legacy monolith to micro-frontends. Improved site performance by 40%."
                },
                {
                    title: "Web Developer",
                    company: "Creative Digital Agency",
                    startDate: "2020-03",
                    endDate: "2021-12",
                    description: "Developed responsive websites for 20+ clients using React and Next.js."
                }
            ],
            education: [
                {
                    school: "University of Indonesia",
                    degree: "Bachelor's",
                    field: "Computer Science",
                    graduationYear: "2019"
                }
            ]
        }

        return NextResponse.json(mockData)
    } catch (error) {
        console.error('Error parsing resume:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
