import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import prismadb from '@/lib/prismadb'

// Regular expression to validate email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    try {
        const { email, name, password } = req.body

        // Validate input data
        if (!email || !name || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' })
        }

        // Validate name: no numbers allowed
        if (/\d/.test(name)) {
            return res
                .status(400)
                .json({ message: 'Name should not contain numbers' })
        }

        // Validate password: at least 6 characters
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password should be at least 6 characters long',
            })
        }

        const existingUser = await prismadb.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return res.status(422).json({ message: 'Email is already taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            },
        })

        return res.status(201).json(user)
    } catch (error) {
        console.error('Error creating user:', error)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}
