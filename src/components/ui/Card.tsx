import { ReactNode } from 'react'
import './Card.css'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
    const classNames = [
        'card',
        `card-padding-${padding}`,
        hover && 'card-hover',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return <div className={classNames}>{children}</div>
}
