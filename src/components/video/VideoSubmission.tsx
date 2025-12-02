'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useRouter } from 'next/navigation'

interface VideoSubmissionProps {
    matchId: string
    videoRequested: boolean
    videoSubmitted: boolean
    videoUrl?: string | null
}

export default function VideoSubmission({
    matchId,
    videoRequested,
    videoSubmitted,
    videoUrl
}: VideoSubmissionProps) {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`/api/matches/${matchId}/video/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoUrl: url }),
            })

            if (res.ok) {
                router.refresh()
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Failed to submit video', error)
        } finally {
            setLoading(false)
        }
    }

    if (!videoRequested && !videoSubmitted) {
        return null // Don't show anything if not requested
    }

    if (videoSubmitted && !isEditing) {
        return (
            <div className="video-submission-status">
                <div className="success-message">
                    <span className="check-icon">✓</span> Video Submitted
                </div>
                <div className="video-actions">
                    <a href={videoUrl || '#'} target="_blank" rel="noopener noreferrer" className="view-link">
                        View
                    </a>
                    <button onClick={() => setIsEditing(true)} className="edit-link">
                        Update
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="video-submission-form">
            <h4>Video Intro Requested</h4>
            <p>The company would like to see a short video introduction from you.</p>

            <form onSubmit={handleSubmit}>
                <Input
                    label="Video URL (Loom, YouTube, etc.)"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    fullWidth
                />
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <Button type="submit" variant="primary" full loading={loading}>
                        Submit Video
                    </Button>
                </div>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="cancel-link"
                        style={{ marginTop: 'var(--spacing-sm)', display: 'block', width: '100%', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    )
}
