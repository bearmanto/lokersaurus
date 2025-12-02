'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import '../admin.css'

interface Match {
    id: string
    score: number
    status: string
    createdAt: string
    job: {
        title: string
        company: { name: string }
    }
    jobseeker: {
        user: {
            name: string
            email: string
        }
    }
}

export default function AdminMatchesPage() {
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchMatches = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                status: statusFilter
            })
            const res = await fetch(`/api/admin/matches?${params}`)
            const data = await res.json()
            if (data.matches) {
                setMatches(data.matches)
                setTotalPages(data.pagination.pages)
            }
        } catch (error) {
            console.error('Failed to fetch matches', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMatches()
    }, [statusFilter, page])

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'PENDING': return 'hr'
            case 'INTERESTED': return 'success'
            case 'CONTACTED': return 'admin'
            case 'REJECTED': return 'error'
            default: return 'hr'
        }
    }

    return (
        <div className="admin-page">
            <div className="dashboard-header">
                <h1 className="dashboard-title serif">Match Moderation</h1>
                <p className="dashboard-subtitle">Monitor matching activity and status</p>
            </div>

            <div className="admin-controls">
                <div className="filter-box">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-select"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="INTERESTED">Interested</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Job</th>
                            <th>Jobseeker</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center p-8">Loading...</td></tr>
                        ) : matches.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8">No matches found</td></tr>
                        ) : (
                            matches.map((match) => (
                                <tr key={match.id}>
                                    <td>
                                        <div className="font-medium">{match.job.title}</div>
                                        <div className="text-xs text-gray-500">{match.job.company.name}</div>
                                    </td>
                                    <td>
                                        <div className="font-medium">{match.jobseeker.user.name}</div>
                                        <div className="text-xs text-gray-500">{match.jobseeker.user.email}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-primary">{match.score}%</span>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${match.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(match.status)}`}>
                                            {match.status}
                                        </span>
                                    </td>
                                    <td>{new Date(match.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    Previous
                </Button>
                <span className="page-info">Page {page} of {totalPages}</span>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
