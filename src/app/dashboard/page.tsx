import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import './dashboard.css'

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    const { user } = session

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1>Welcome back, {user.name || user.email}!</h1>
                    <p className="text-secondary">
                        {user.role === 'JOBSEEKER' && 'Manage your profile and find your dream job'}
                        {user.role === 'HR' && 'Post jobs and manage applications'}
                        {user.role === 'ADMIN' && 'Platform administration and analytics'}
                    </p>
                </div>

                <div className="dashboard-grid">
                    <Link href="/profile" className="dashboard-card-link">
                        <Card className="dashboard-card" hover>
                            <div className="dashboard-card-icon">👤</div>
                            <h3>My Profile</h3>
                            <p>Update your profile information</p>
                        </Card>
                    </Link>

                    {user.role === 'JOBSEEKER' && (
                        <>
                            <Link href="/jobs" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">📋</div>
                                    <h3>Browse Jobs</h3>
                                    <p>Discover new opportunities</p>
                                </Card>
                            </Link>

                            <Link href="/applications" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">📝</div>
                                    <h3>My Applications</h3>
                                    <p>Track your job applications</p>
                                </Card>
                            </Link>

                            <Link href="/saved-jobs" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">⭐</div>
                                    <h3>Saved Jobs</h3>
                                    <p>Your bookmarked positions</p>
                                </Card>
                            </Link>
                        </>
                    )}

                    {user.role === 'HR' && (
                        <>
                            <Link href="/jobs/new" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">➕</div>
                                    <h3>Post a Job</h3>
                                    <p>Create a new job listing</p>
                                </Card>
                            </Link>

                            <Link href="/jobs/my-jobs" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">📋</div>
                                    <h3>My Job Posts</h3>
                                    <p>Manage your listings</p>
                                </Card>
                            </Link>

                            <Link href="/applications" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">📩</div>
                                    <h3>Applications</h3>
                                    <p>Review candidate applications</p>
                                </Card>
                            </Link>
                        </>
                    )}

                    {user.role === 'ADMIN' && (
                        <>
                            <Link href="/admin/users" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">👥</div>
                                    <h3>User Management</h3>
                                    <p>Manage platform users</p>
                                </Card>
                            </Link>

                            <Link href="/admin/jobs" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">🔍</div>
                                    <h3>Job Moderation</h3>
                                    <p>Review and moderate listings</p>
                                </Card>
                            </Link>

                            <Link href="/admin/analytics" className="dashboard-card-link">
                                <Card className="dashboard-card" hover>
                                    <div className="dashboard-card-icon">📊</div>
                                    <h3>Analytics</h3>
                                    <p>Platform insights and metrics</p>
                                </Card>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
