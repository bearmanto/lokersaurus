'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import './CandidateFilters.css'

export default function CandidateFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState({
        skills: searchParams.get('skills') || '',
        remote: searchParams.get('remote') || '',
        minSalary: searchParams.get('minSalary') || '',
    })

    const handleApplyFilters = () => {
        const params = new URLSearchParams()
        if (filters.skills) params.set('skills', filters.skills)
        if (filters.remote) params.set('remote', filters.remote)
        if (filters.minSalary) params.set('minSalary', filters.minSalary)

        router.push(`/candidates?${params.toString()}`)
    }

    const handleClearFilters = () => {
        setFilters({ skills: '', remote: '', minSalary: '' })
        router.push('/candidates')
    }

    return (
        <Card className="filters-card">
            <div className="filters-grid">
                <Input
                    label="Skills (comma separated)"
                    placeholder="e.g. JavaScript, React, Node.js"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    fullWidth
                />

                <div className="form-group">
                    <label>Work Style</label>
                    <select
                        value={filters.remote}
                        onChange={(e) => setFilters({ ...filters, remote: e.target.value })}
                        className="input"
                    >
                        <option value="">All</option>
                        <option value="REMOTE">Remote</option>
                        <option value="ONSITE">On-site</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>

                <Input
                    label="Minimum Salary Expectation"
                    type="number"
                    placeholder="50000"
                    value={filters.minSalary}
                    onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
                    fullWidth
                />
            </div>

            <div className="filters-actions">
                <Button variant="secondary" onClick={handleClearFilters}>
                    Clear Filters
                </Button>
                <Button variant="primary" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
            </div>
        </Card>
    )
}
