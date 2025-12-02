import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import Navbar from '@/components/layout/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lokersaurus - Reverse Job Board',
  description: 'Get discovered by companies. Stop searching, start getting found.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main className="page-content">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}
