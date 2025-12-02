'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface InterestedButtonProps {
    matchId: string
    currentStatus: string
}

export default function InterestedButton({ matchId, currentStatus }: InterestedButtonProps) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    const handleInterested = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/matches/${matchId}/interested`, {
                method: 'POST',
            })

            if (response.ok) {
                setStatus('INTERESTED')
            }
        } catch (error) {
            console.error('Failed to mark as interested:', error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'INTERESTED') {
        return (
            <div className="interested-message">
                <span>✓ You've expressed interest in this role</span>
                <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                    The company has been notified and can now contact you.
                </p>
            </div>
        )
    }

    if (status === 'CONTACTED') {
        return (
            <div className="contacted-message">
                <span>✓ Company has contacted you</span>
                <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                    Check your messages for communication from the company.
                </p>
            </div>
        )
    }

    return (
        <Button
            variant="primary"
            size="lg"
            full
            onClick={handleInterested}
            loading={loading}
        >
            I'm Interested
        </Button>
    )
}
