import './Button.css'

interface ButtonProps {
    children: React.ReactNode
    variant?: 'primary' | 'secondary' | 'outline' | 'text'
    size?: 'sm' | 'md' | 'lg'
    type?: 'button' | 'submit' | 'reset'
    full?: boolean
    loading?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    full = false,
    loading = false,
    disabled = false,
    onClick,
    className = '',
}: ButtonProps) {
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`
    const loadingClass = loading ? 'btn-loading' : ''
    const fullClass = full ? 'btn-full' : ''

    return (
        <button
            type={type}
            className={`btn ${variantClass} ${sizeClass} ${loadingClass} ${fullClass} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {children}
        </button>
    )
}
