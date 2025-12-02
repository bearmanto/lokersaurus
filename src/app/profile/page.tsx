import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/profile/ProfileForm'
import './profile.css'

export default async function JobseekerProfilePage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    if (session.user.role !== 'JOBSEEKER') {
        redirect('/dashboard')
    }

    // Fetch existing profile
    const profile = await prisma.jobseekerProfile.findUnique({
        where: { userId: session.user.id },
    })

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Complete Your Profile</h1>
                    <p>Help companies find you by providing detailed information about your skills and experience.</p>
                </div>

                <ProfileForm initialData={profile} userId={session.user.id} />
            </div>
        </div>
    )
}
