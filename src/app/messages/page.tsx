import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ConversationList from '@/components/messaging/ConversationList'
import './messages.css'

export default async function MessagesPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="messages-page">
            <div className="container">
                <h1>Messages</h1>
                <div className="messages-layout">
                    <div className="messages-sidebar">
                        <ConversationList />
                    </div>
                    <div className="messages-main empty">
                        <div className="select-chat-placeholder">
                            <h3>Select a conversation</h3>
                            <p>Choose a match from the list to start chatting.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
