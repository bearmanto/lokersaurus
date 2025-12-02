import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding assessments...')

    const assessments = [
        {
            title: 'React.js Fundamentals',
            slug: 'react-fundamentals',
            description: 'Test your knowledge of React core concepts, hooks, and component lifecycle.',
            icon: 'react',
            questions: [
                {
                    text: 'What is the primary purpose of useEffect?',
                    options: JSON.stringify(['To handle side effects', 'To create state', 'To render HTML', 'To style components']),
                    correctOption: 0
                },
                {
                    text: 'Which hook is used to manage state in a functional component?',
                    options: JSON.stringify(['useEffect', 'useState', 'useContext', 'useReducer']),
                    correctOption: 1
                },
                {
                    text: 'What prevents a React component from re-rendering unnecessarily?',
                    options: JSON.stringify(['React.memo', 'useMemo', 'useCallback', 'All of the above']),
                    correctOption: 3
                }
            ]
        },
        {
            title: 'Node.js Backend',
            slug: 'node-backend',
            description: 'Evaluate your proficiency in building server-side applications with Node.js.',
            icon: 'node',
            questions: [
                {
                    text: 'What is the event loop in Node.js?',
                    options: JSON.stringify(['A loop that handles synchronous code', 'A mechanism to handle non-blocking I/O', 'A database connection pool', 'A routing middleware']),
                    correctOption: 1
                },
                {
                    text: 'Which module is used for file system operations?',
                    options: JSON.stringify(['http', 'fs', 'path', 'os']),
                    correctOption: 1
                }
            ]
        },
        {
            title: 'UI/UX Design Principles',
            slug: 'design-principles',
            description: 'Assess your understanding of user interface and user experience design standards.',
            icon: 'design',
            questions: [
                {
                    text: 'What does "white space" refer to in design?',
                    options: JSON.stringify(['The color white', 'Empty space around elements', 'The background color', 'The margin of the page']),
                    correctOption: 1
                }
            ]
        }
    ]

    for (const a of assessments) {
        const assessment = await prisma.assessment.upsert({
            where: { slug: a.slug },
            update: {},
            create: {
                title: a.title,
                slug: a.slug,
                description: a.description,
                icon: a.icon,
                questions: {
                    create: a.questions
                }
            }
        })
        console.log(`Created assessment: ${assessment.title}`)
    }

    console.log('Seeding completed.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
