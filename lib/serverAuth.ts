import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prismadb from '@/lib/prismadb'

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await getServerSession(req, res, authOptions)

        if (!session || !session.user || !session.user.email) {
            throw new Error('Not signed in')
        }

        const currentUser = await prismadb.user.findUnique({
            where: { email: session.user.email },
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
