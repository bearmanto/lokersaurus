'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { hash } from 'bcryptjs'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import './auth.css'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'JOBSEEKER' as 'JOBSEEKER' | 'HR',
        companyName: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Registration failed')
                return
            }

            router.push('/login?registered=true')
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Card className="auth-card">
                    <div className="auth-header">
                        <h1>Create your account</h1>
                        <p>Join Lokersaurus and start your journey</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            type="text"
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            type="email"
                            label="Email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            fullWidth
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            fullWidth
                        />

                        <div className="role-selector">
                            <label className="role-label">I am a:</label>
                            <div className="role-options">
                                <label className={`role-option ${formData.role === 'JOBSEEKER' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="JOBSEEKER"
                                        checked={formData.role === 'JOBSEEKER'}
                                        onChange={(e) => setFormData({ ...formData, role: 'JOBSEEKER', companyName: '' })}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">👤</span>
                                        <span className="role-text">Jobseeker</span>
                                    </div>
                                </label>

                                <label className={`role-option ${formData.role === 'HR' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="HR"
                                        checked={formData.role === 'HR'}
                                        onChange={(e) => setFormData({ ...formData, role: 'HR' })}
                                    />
                                    <div className="role-content">
                                        <span className="role-icon">🏢</span>
                                        <span className="role-text">Company / HR</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {formData.role === 'HR' && (
                            <Input
                                type="text"
                                label="Company Name"
                                placeholder="Your Company Inc."
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                                fullWidth
                            />
                        )}

                        <Button type="submit" fullWidth loading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link href="/login">Sign in</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
