import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import JobForm from '@/components/jobs/JobForm'
import './new-job.css'

export default async function NewJobPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    if (session.user.role !== 'HR') {
        redirect('/dashboard')
    }

    // Fetch company profile
    const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
    })

    if (!company) {
        redirect('/profile/company') // Redirect to create company profile first
    }

    return (
        <div className="new-job-page">
            <div className="container">
                <div className="page-header">
                    <h1>Post a New Job</h1>
                    <p>Fill in the details below and we'll automatically match you with qualified candidates.</p>
                </div>

                <JobForm companyId={company.id} />
            </div>
        </div>
    )
}
