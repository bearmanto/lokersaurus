'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import './Navbar.css'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container">
                <div className="navbar-content">
                    <Link href="/" className="navbar-logo serif">
                        Lokersaurus
                    </Link>

                    <div className="navbar-links">
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`navbar-link uppercase ${pathname === '/dashboard' ? 'active' : ''}`}
                                >
                                    Dashboard
                                </Link>

                                {session.user.role === 'JOBSEEKER' && (
                                    <>
                                        <Link
                                            href="/matches"
                                            className={`navbar-link uppercase ${pathname === '/matches' ? 'active' : ''}`}
                                        >
                                            Matches
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className={`navbar-link uppercase ${pathname === '/profile' ? 'active' : ''}`}
                                        >
                                            Profile
                                        </Link>
                                    </>
                                )}

                                {session.user.role === 'HR' && (
                                    <>
                                        <Link
                                            href="/jobs/new"
                                            className={`navbar-link uppercase ${pathname === '/jobs/new' ? 'active' : ''}`}
                                        >
                                            Post Job
                                        </Link>
                                        <Link
                                            href="/candidates"
                                            className={`navbar-link uppercase ${pathname === '/candidates' ? 'active' : ''}`}
                                        >
                                            Candidates
                                        </Link>
                                    </>
                                )}

                                <Link href="/api/auth/signout" className="navbar-link uppercase">
                                    Sign Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={`navbar-link uppercase ${pathname === '/login' ? 'active' : ''}`}>
                                    Sign In
                                </Link>
                                <Link href="/register" className="navbar-cta">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
