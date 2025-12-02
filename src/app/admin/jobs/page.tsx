'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import '../admin.css'

interface Job {
    id: string
    title: string
    status: string
    createdAt: string
    company: {
        name: string
        logo: string | null
    }
    _count: {
        matches: number
        applications: number
    }
}

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
                status: statusFilter
            })
            const res = await fetch(`/api/admin/jobs?${params}`)
            const data = await res.json()
            if (data.jobs) {
                setJobs(data.jobs)
                setTotalPages(data.pagination.pages)
            }
        } catch (error) {
            console.error('Failed to fetch jobs', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchJobs()
        }, 300)
        return () => clearTimeout(debounce)
    }, [search, statusFilter, page])

    const handleStatusUpdate = async (jobId: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/jobs', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, status: newStatus })
            })

            if (res.ok) {
                setJobs(jobs.map(j =>
                    j.id === jobId ? { ...j, status: newStatus } : j
                ))
            }
        } catch (error) {
            console.error('Failed to update job', error)
        }
    }

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success'
            case 'CLOSED': return 'error' // or gray
            case 'DRAFT': return 'hr' // blueish
            case 'REJECTED': return 'error'
            default: return 'admin'
        }
    }

    return (
        <div className="admin-page">
            <div className="dashboard-header">
                <h1 className="dashboard-title serif">Job Moderation</h1>
                <p className="dashboard-subtitle">Review and manage job postings</p>
            </div>

            <div className="admin-controls">
                <div className="search-box">
                    <Input
                        placeholder="Search jobs or companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-select"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="DRAFT">Draft</option>
                        <option value="CLOSED">Closed</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Job Details</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Stats</th>
                            <th>Posted</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center p-8">Loading...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-8">No jobs found</td></tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id}>
                                    <td>
                                        <div className="font-medium">{job.title}</div>
                                        <div className="text-xs text-gray-500">ID: {job.id.slice(0, 8)}...</div>
                                    </td>
                                    <td>{job.company.name}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadgeClass(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="activity-stats">
                                            <span title="Matches">🎯 {job._count.matches}</span>
                                            <span title="Applications">📝 {job._count.applications}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons flex gap-2">
                                            {job.status === 'DRAFT' && (
                                                <Button
                                                    size="sm"
                                                    className="btn-success"
                                                    onClick={() => handleStatusUpdate(job.id, 'ACTIVE')}
                                                >
                                                    Approve
                                                </Button>
                                            )}

                                            {job.status === 'ACTIVE' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="btn-danger"
                                                    onClick={() => handleStatusUpdate(job.id, 'CLOSED')}
                                                >
                                                    Close
                                                </Button>
                                            )}

                                            {job.status === 'CLOSED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStatusUpdate(job.id, 'ACTIVE')}
                                                >
                                                    Reopen
                                                </Button>
                                            )}
                                        </div>
                                    </td>
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
