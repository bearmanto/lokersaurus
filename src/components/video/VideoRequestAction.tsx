'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface VideoRequestActionProps {
    matchId: string
    videoRequested: boolean
    videoSubmitted: boolean
    videoUrl?: string | null
}

export default function VideoRequestAction({
    matchId,
    videoRequested,
    videoSubmitted,
    videoUrl
}: VideoRequestActionProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRequest = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/matches/${matchId}/video/request`, {
                method: 'POST',
            })

            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to request video', error)
        } finally {
            setLoading(false)
        }
    }

    if (videoSubmitted && videoUrl) {
        return (
            <div className="video-status submitted">
                <p className="status-label">Video Intro Submitted</p>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm" full>
                        Watch Video Intro
                    </Button>
                </a>
            </div>
        )
    }

    if (videoRequested) {
        return (
            <div className="video-status pending">
                <p className="status-label">Video Requested</p>
                <p className="status-sub">Waiting for candidate...</p>
            </div>
        )
    }

    return (
        <div className="video-action">
            <Button
                variant="secondary"
                size="sm"
                full
                onClick={handleRequest}
                loading={loading}
            >
                Request Video Intro
            </Button>
        </div>
    )
}
