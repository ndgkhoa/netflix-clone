import { NextApiRequest, NextApiResponse } from 'next'
import serverAuth from '@/lib/serverAuth'
import prismadb from '@/lib/prismadb'
import { without } from 'lodash'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const { currentUser } = await serverAuth(req)
        if (!currentUser) {
            return res.status(401).json({ message: 'User not authenticated' })
        }

        if (req.method === 'POST') {
            const { movieId } = req.body

            const existingMovie = await prismadb.movie.findUnique({
                where: {
                    id: movieId,
                },
            })

            if (!existingMovie) {
                throw new Error('Invalid ID')
            }

            const updatedUser = await prismadb.user.update({
                where: { email: currentUser.email as string },
                data: { favoriteIds: { push: movieId } },
            })

            return res.status(200).json(updatedUser)
        }

        if (req.method === 'DELETE') {
            const { movieId } = req.body

            const existingMovie = await prismadb.movie.findUnique({
                where: { id: movieId },
            })

            if (!existingMovie) {
                throw new Error('Invalid ID')
            }

            const updatedFavoriteIds = without(currentUser.favoriteIds, movieId)

            const updatedUser = await prismadb.user.update({
                where: { email: currentUser.email as string },
                data: { favoriteIds: updatedFavoriteIds },
            })

            return res.status(200).json(updatedUser)
        }

        return res.status(405).end()
    } catch (error) {
        console.error('Error in API handler:', error)
        return res.status(400).json({ message: 'Request failed' })
    }
}
