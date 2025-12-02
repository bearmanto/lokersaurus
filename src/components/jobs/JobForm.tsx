'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import SkillsInput from '@/components/profile/SkillsInput'
import './JobForm.css'

interface JobFormProps {
    companyId: string
}

export default function JobForm({ companyId }: JobFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        requiredSkills: [] as string[],
        experienceLevel: '',
        jobType: '',
        remote: '',
        minSalary: '',
        maxSalary: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, companyId }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create job')
            }

            // Redirect to matches view
            router.push(`/jobs/${data.job.id}/matches`)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="job-form">
            {error && <div className="form-error">{error}</div>}

            {/* Basic Details */}
            <Card className="form-section">
                <h2>Job Details</h2>

                <Input
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Developer"
                    required
                    fullWidth
                />

                <div className="form-group">
                    <label>Job Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the role, responsibilities, and requirements..."
                        className="input"
                        rows={6}
                        required
                    />
                </div>

                <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA or Remote"
                    fullWidth
                />
            </Card>

            {/* Requirements */}
            <Card className="form-section">
                <h2>Requirements</h2>

                <div className="form-group">
                    <label>Required Skills</label>
                    <SkillsInput
                        skills={formData.requiredSkills}
                        onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
                    />
                </div>

                <div className="form-group">
                    <label>Experience Level</label>
                    <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="input"
                        required
                    >
                        <option value="">Select experience level...</option>
                        <option value="ENTRY">Entry Level (0-2 years)</option>
                        <option value="MID">Mid Level (2-5 years)</option>
                        <option value="SENIOR">Senior Level (5+ years)</option>
                        <option value="LEAD">Lead/Principal (8+ years)</option>
                    </select>
                </div>
            </Card>

            {/* Job Type & Compensation */}
            <Card className="form-section">
                <h2>Job Type & Compensation</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label>Job Type</label>
                        <select
                            value={formData.jobType}
                            onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Select...</option>
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="FREELANCE">Freelance</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Work Style</label>
                        <select
                            value={formData.remote}
                            onChange={(e) => setFormData({ ...formData, remote: e.target.value })}
                            className="input"
                            required
                        >
                            <option value="">Select...</option>
                            <option value="REMOTE">Remote</option>
                            <option value="ONSITE">On-site</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <Input
                        label="Minimum Salary (USD/year)"
                        name="minSalary"
                        type="number"
                        value={formData.minSalary}
                        onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                        placeholder="60000"
                        fullWidth
                    />

                    <Input
                        label="Maximum Salary (USD/year)"
                        name="maxSalary"
                        type="number"
                        value={formData.maxSalary}
                        onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                        placeholder="100000"
                        fullWidth
                    />
                </div>
            </Card>

            <div className="form-actions">
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" size="lg" loading={loading}>
                    Publish Job & Find Candidates
                </Button>
            </div>
        </form>
    )
}
