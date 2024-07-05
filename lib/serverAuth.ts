import { NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'
import prismadb from '@/lib/prismadb'

const serverAuth = async (req: NextApiRequest) => {
    try {
        const session = await getSession({ req })

        if (!session || !session.user || !session.user.email) {
            throw new Error('Not signed in')
        }

        const currentUser = await prismadb.user.findUnique({
            where: {
                email: session.user.email,
            },
        })

        if (!currentUser) {
            throw new Error('User not found')
        }

        return { currentUser }
    } catch (error) {
        console.error('Error in serverAuth:', error)
        throw new Error('Authentication failed')
    }
}

export default serverAuth
