'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import './ConversationList.css'

interface Conversation {
    id: string
    otherUser: {
        name: string
        image?: string
        title?: string
    }
    jobTitle: string
    lastMessage?: {
        content: string
        createdAt: string
        isRead: boolean
    }
    updatedAt: string
}

export default function ConversationList({ activeId }: { activeId?: string }) {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/conversations')
                if (res.ok) {
                    const data = await res.json()
                    setConversations(data.conversations)
                }
            } catch (error) {
                console.error('Failed to fetch conversations', error)
            } finally {
                setLoading(false)
            }
        }

        fetchConversations()
    }, [])

    if (loading) {
        return <div className="conv-loading">Loading conversations...</div>
    }

    if (conversations.length === 0) {
        return (
            <div className="conv-empty">
                <p>No conversations yet.</p>
            </div>
        )
    }

    return (
        <div className="conversation-list">
            <h3>Messages</h3>
            <div className="conv-items">
                {conversations.map((conv) => (
                    <Link
                        href={`/messages/${conv.id}`}
                        key={conv.id}
                        className={`conv-item ${activeId === conv.id ? 'active' : ''}`}
                    >
                        <div className="conv-avatar">
                            {conv.otherUser.name.charAt(0)}
                        </div>
                        <div className="conv-info">
                            <div className="conv-top">
                                <span className="conv-name">{conv.otherUser.name}</span>
                                <span className="conv-time">
                                    {new Date(conv.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="conv-job">{conv.jobTitle}</p>
                            <p className="conv-preview">
                                {conv.lastMessage ? conv.lastMessage.content : 'Start a conversation'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
