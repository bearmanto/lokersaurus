'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import './ChatWindow.css'

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: string
    sender: {
        name: string
        image?: string
    }
}

interface ChatWindowProps {
    matchId: string
    otherUser: {
        name: string
        title?: string
    }
}

export default function ChatWindow({ matchId, otherUser }: ChatWindowProps) {
    const { data: session } = useSession()
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages/${matchId}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data.messages)
            }
        } catch (error) {
            console.error('Failed to fetch messages', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
    }, [matchId])

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [bookingUrl, setBookingUrl] = useState('')

    const handleSend = async (e?: React.FormEvent, type: string = 'TEXT', metadata: any = null, contentOverride?: string) => {
        if (e) e.preventDefault()

        const contentToSend = contentOverride || newMessage
        if (!contentToSend.trim()) return

        setSending(true)
        try {
            const res = await fetch(`/api/messages/${matchId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: contentToSend,
                    type,
                    metadata
                }),
            })

            if (res.ok) {
                setNewMessage('')
                setShowScheduleModal(false)
                setBookingUrl('')
                fetchMessages() // Refresh immediately
            }
        } catch (error) {
            console.error('Failed to send message', error)
        } finally {
            setSending(false)
        }
    }

    const handleScheduleSubmit = () => {
        if (!bookingUrl) return
        handleSend(undefined, 'SCHEDULING', { url: bookingUrl }, '📅 Interview Invitation')
    }

    if (loading) {
        return <div className="chat-loading">Loading conversation...</div>
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div>
                    <h3>{otherUser.name}</h3>
                    {otherUser.title && <span className="chat-subtitle">{otherUser.title}</span>}
                </div>
                {session?.user?.role === 'HR' && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowScheduleModal(true)}
                    >
                        📅 Schedule Interview
                    </Button>
                )}
            </div>

            <div className="messages-list">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg: any) => {
                        const isMe = msg.senderId === session?.user?.id
                        const metadata = msg.metadata ? JSON.parse(msg.metadata) : null

                        return (
                            <div key={msg.id} className={`message-bubble ${isMe ? 'me' : 'them'} ${msg.type === 'SCHEDULING' ? 'scheduling' : ''}`}>
                                <div className="message-content">
                                    {msg.type === 'SCHEDULING' ? (
                                        <div className="scheduling-card">
                                            <h4>📅 Interview Invitation</h4>
                                            <p>You are invited to schedule an interview.</p>
                                            <a href={metadata?.url} target="_blank" rel="noopener noreferrer" className="book-button">
                                                Book a Time
                                            </a>
                                        </div>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                                <span className="message-time">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={(e) => handleSend(e)} className="chat-input-area">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={sending}
                    className="chat-input"
                />
                <Button type="submit" variant="primary" loading={sending} disabled={!newMessage.trim()}>
                    Send
                </Button>
            </form>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Schedule Interview</h3>
                        <p>Paste your Calendly or Booking URL below:</p>
                        <Input
                            value={bookingUrl}
                            onChange={(e) => setBookingUrl(e.target.value)}
                            placeholder="https://calendly.com/..."
                            fullWidth
                            className="mb-4"
                        />
                        <div className="modal-actions">
                            <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                            <Button onClick={handleScheduleSubmit} disabled={!bookingUrl}>Send Invitation</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
