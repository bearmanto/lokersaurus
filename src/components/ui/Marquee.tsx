import React from 'react'
import './Marquee.css'

interface MarqueeProps {
    children: React.ReactNode
    direction?: 'left' | 'right'
    speed?: 'slow' | 'normal' | 'fast'
    className?: string
    pauseOnHover?: boolean
}

export default function Marquee({
    children,
    direction = 'left',
    speed = 'normal',
    className = '',
    pauseOnHover = false,
}: MarqueeProps) {
    return (
        <div className={`marquee-container ${className}`}>
            <div
                className={`marquee-content ${direction} ${speed} ${pauseOnHover ? 'pause-on-hover' : ''}`}
            >
                {children}
                {/* Duplicate content for seamless loop */}
                {children}
                {children}
                {children}
            </div>
        </div>
    )
}
