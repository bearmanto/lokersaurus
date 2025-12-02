export { auth as middleware } from '@/lib/auth'

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/jobs/new', '/jobs/:id/edit', '/admin/:path*'],
}
