import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@lokersaurus.com' },
        update: {},
        create: {
            email: 'admin@lokersaurus.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
            banned: false,
        },
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
