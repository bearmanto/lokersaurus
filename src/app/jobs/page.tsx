import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import './jobs.css'

export default function JobsPage() {
    return (
        <div className="jobs-page">
            <div className="container">
                <div className="jobs-header">
                    <h1>Browse Jobs</h1>
                    <p className="text-secondary">Discover your next opportunity</p>
                </div>

                <div className="jobs-placeholder">
                    <div className="placeholder-icon">🔍</div>
                    <h3>Job Listings Coming Soon</h3>
                    <p>
                        This feature is under development. You'll be able to search and filter jobs,
                        view detailed job descriptions, and apply directly through the platform.
                    </p>
                </div>
            </div>
        </div>
    )
}
