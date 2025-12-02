'use client'

import { useEffect, useState } from 'react'

interface Stats {
    totalUsers: number
    totalJobs: number
    activeJobs: number
    totalMatches: number
}

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [recentUsers, setRecentUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                const data = await res.json()
                if (data.stats) {
                    setStats(data.stats)
                    setRecentUsers(data.recentUsers)
                }
            } catch (error) {
                console.error('Failed to fetch stats', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1 className="dashboard-title serif">Platform Overview</h1>
                <p className="dashboard-subtitle">Welcome back, Admin.</p>
            </div>

            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Users</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Jobs</div>
                        <div className="stat-value">{stats.totalJobs}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Active Jobs</div>
                        <div className="stat-value">{stats.activeJobs}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Matches</div>
                        <div className="stat-value">{stats.totalMatches}</div>
                    </div>
                </div>
            )}

            <div className="recent-section">
                <div className="section-header">
                    <h2 className="serif">Recent Users</h2>
                </div>
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`status-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
