'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ResumeUploader from './ResumeUploader'

// ... imports

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
    // ... existing state

    const handleResumeUpload = (data: any) => {
        setFormData(prev => ({
            ...prev,
            bio: data.bio || prev.bio,
            skills: [...new Set([...prev.skills, ...(data.skills || [])])],
            experience: [...(data.experience || []), ...prev.experience],
            education: [...(data.education || []), ...prev.education],
        }))
    }

    // ... handleSubmit

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            {error && <div className="form-error">{error}</div>}

            {/* Resume Auto-Fill */}
            <Card className="form-section mb-8">
                <h2>Quick Start</h2>
                <ResumeUploader onUploadComplete={handleResumeUpload} />
            </Card>

            {/* Basic Information */}
            <Card className="form-section">
                <h2>Basic Information</h2>

                <Input
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    fullWidth
                />

                <div className="form-row">
                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        fullWidth
                    />

                    <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        fullWidth
                    />
                </div>
            </Card>

            {/* Skills */}
            <Card className="form-section">
                <h2>Skills</h2>
                <SkillsInput
                    skills={formData.skills}
                    onChange={(skills) => setFormData({ ...formData, skills })}
                />
            </Card>

            {/* Experience */}
            <Card className="form-section">
                <h2>Work Experience</h2>
                <ExperienceForm
                    experience={formData.experience}
                    onChange={(experience) => setFormData({ ...formData, experience })}
                />
            </Card>

            {/* Education */}
            <Card className="form-section">
                <h2>Education</h2>
                <ExperienceForm
                    experience={formData.education}
                    onChange={(education) => setFormData({ ...formData, education })}
                    type="education"
                />
            </Card>

            {/* Links */}
            <Card className="form-section">
                <h2>Links & Files</h2>

                <Input
                    label="Resume URL"
                    name="resumeUrl"
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://..."
                    fullWidth
                />

                <Input
                    label="Portfolio URL"
                    name="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://..."
                    fullWidth
                />
            </Card>

            {/* Preferences */}
            <Card className="form-section">
                <h2>Job Preferences</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label>Job Type</label>
                        <select
                            value={formData.jobType}
                            onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                            className="input"
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
                        label="Minimum Salary (USD)"
                        name="minSalary"
                        type="number"
                        value={formData.minSalary}
                        onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                        placeholder="50000"
                        fullWidth
                    />

                    <Input
                        label="Maximum Salary (USD)"
                        name="maxSalary"
                        type="number"
                        value={formData.maxSalary}
                        onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                        placeholder="80000"
                        fullWidth
                    />
                </div>

                <div className="form-group">
                    <label>Availability</label>
                    <select
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                        className="input"
                    >
                        <option value="">Select...</option>
                        <option value="IMMEDIATE">Immediate</option>
                        <option value="2_WEEKS">2 Weeks Notice</option>
                        <option value="1_MONTH">1 Month Notice</option>
                        <option value="3_MONTHS">3 Months Notice</option>
                    </select>
                </div>

                <div className="form-checkbox">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive">Make my profile visible to companies (they can find and match with me)</label>
                </div>
            </Card>

            <div className="form-actions">
                <Button type="submit" variant="primary" size="lg" loading={loading} full>
                    Save Profile
                </Button>
            </div>
        </form>
    )
}
