import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ConversationList from '@/components/messaging/ConversationList'
import ChatWindow from '@/components/messaging/ChatWindow'
import '../messages.css'

export default async function ChatPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    // Fetch match details to get other user info
    const match = await prisma.match.findUnique({
        where: { id: params.id },
        include: {
            job: {
                include: {
                    company: {
                        include: { user: true }
                    }
                }
            },
            jobseeker: {
                include: { user: true }
            }
        }
    })

    if (!match) {
        notFound()
    }

    // Determine other user
    let otherUser
    if (session.user.role === 'HR') {
        otherUser = {
            name: match.jobseeker.user.name || 'Candidate',
            title: 'Candidate'
        }
    } else {
        otherUser = {
            name: match.job.company.name,
            title: match.job.title
        }
    }

    return (
        <div className="messages-page">
            <div className="container">
                <h1>Messages</h1>
                <div className="messages-layout">
                    <div className="messages-sidebar">
                        <ConversationList activeId={params.id} />
                    </div>
                    <div className="messages-main">
                        <ChatWindow matchId={params.id} otherUser={otherUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}
