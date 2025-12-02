import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import './admin.css'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo serif">LOKERSAURUS <span className="admin-badge">ADMIN</span></div>
                <nav className="admin-nav">
                    <Link href="/admin" className="admin-nav-item">
                        <span className="icon">📊</span> Dashboard
                    </Link>
                    <Link href="/admin/users" className="admin-nav-item">
                        <span className="icon">👥</span> Users
                    </Link>
                    <Link href="/admin/jobs" className="admin-nav-item">
                        <span className="icon">💼</span> Jobs
                    </Link>
                    <Link href="/admin/matches" className="admin-nav-item">
                        <span className="icon">🎯</span> Matches
                    </Link>
                    <Link href="/admin/settings" className="admin-nav-item">
                        <span className="icon">⚙️</span> Settings
                    </Link>
                </nav>
                <div className="admin-user">
                    <div className="admin-avatar">A</div>
                    <div className="admin-user-info">
                        <div className="name">{session.user.name || 'Admin'}</div>
                        <div className="role">Administrator</div>
                    </div>
                </div>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    )
}
