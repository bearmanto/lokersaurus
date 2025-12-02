'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import '../admin.css'

interface User {
    id: string
    name: string
    email: string
    role: string
    banned: boolean
    createdAt: string
    _count: {
        sentMessages: number
        receivedMessages: number
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                search,
                role: roleFilter
            })
            const res = await fetch(`/api/admin/users?${params}`)
            const data = await res.json()
            if (data.users) {
                setUsers(data.users)
                setTotalPages(data.pagination.pages)
            }
        } catch (error) {
            console.error('Failed to fetch users', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers()
        }, 300)
        return () => clearTimeout(debounce)
    }, [search, roleFilter, page])

    const handleAction = async (userId: string, action: 'BAN' | 'ROLE', value: any) => {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action, value })
            })

            if (res.ok) {
                // Refresh list locally
                setUsers(users.map(u => {
                    if (u.id === userId) {
                        if (action === 'BAN') return { ...u, banned: value }
                        if (action === 'ROLE') return { ...u, role: value }
                    }
                    return u
                }))
            }
        } catch (error) {
            console.error('Failed to update user', error)
        }
    }

    return (
        <div className="admin-page">
            <div className="dashboard-header">
                <h1 className="dashboard-title serif">User Management</h1>
                <p className="dashboard-subtitle">Manage platform users and permissions</p>
            </div>

            <div className="admin-controls">
                <div className="search-box">
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="admin-select"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="JOBSEEKER">Jobseekers</option>
                        <option value="HR">HR / Companies</option>
                        <option value="ADMIN">Admins</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Activity</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center p-8">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-8">No users found</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className={user.banned ? 'row-banned' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-email">{user.email}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.banned ? (
                                            <span className="status-badge error">BANNED</span>
                                        ) : (
                                            <span className="status-badge success">ACTIVE</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="activity-stats">
                                            <span title="Messages Sent">↗ {user._count.sentMessages}</span>
                                            <span title="Messages Received">↙ {user._count.receivedMessages}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {user.banned ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction(user.id, 'BAN', false)}
                                                >
                                                    Unban
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="btn-danger"
                                                    onClick={() => handleAction(user.id, 'BAN', true)}
                                                    disabled={user.role === 'ADMIN'}
                                                >
                                                    Ban
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
