'use client'
import Input from '@/components/Input'
import axios from 'axios'
import { useCallback, useState } from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const Auth = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [variant, setVariant] = useState('login')

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) =>
            currentVariant === 'login' ? 'register' : 'login',
        )
    }, [])

    const login = useCallback(async () => {
        try {
            const result = await signIn('credentials', {
                email,
                password,
                callbackUrl: '/',
                redirect: false,
            })

            if (result?.ok) {
                toast.success('Login successful!')
                router.push('/')
            } else {
                toast.error(result?.error || 'Login failed!')
            }
        } catch (error) {
            toast.error('An error occurred during login.')
        }
    }, [email, password])

    const register = useCallback(async () => {
        try {
            const response = await axios.post('/api/register', {
                email,
                name,
                password,
            })

            if (response.status === 201) {
                toast.success('Registration successful!')
                login()
            } else {
                toast.error('Registration failed! ')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message)
            }
        }
    }, [email, name, password, login])

    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpeg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="logo" className="h-12" />
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign in' : 'Register'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (
                                <Input
                                    label="Name"
                                    onChange={(e: any) =>
                                        setName(e.target.value)
                                    }
                                    id="name"
                                    value={name}
                                />
                            )}
                            <Input
                                label="Email"
                                onChange={(e: any) => setEmail(e.target.value)}
                                id="email"
                                type="email"
                                value={email}
                            />
                            <Input
                                label="Password"
                                onChange={(e: any) =>
                                    setPassword(e.target.value)
                                }
                                id="password"
                                type="password"
                                value={password}
                            />
                        </div>
                        <button
                            onClick={variant === 'login' ? login : register}
                            className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
                        >
                            {variant === 'login' ? 'Login' : 'Sign up'}
                        </button>
                        <div className="flex flex-row items center gap-4 mt-8 justify-center">
                            <div
                                onClick={async () => {
                                    const result = await signIn('google', {
                                        callbackUrl: '/',
                                        redirect: false,
                                    })

                                    if (result?.ok) {
                                        toast.success('Logged in with Google!')
                                    } else {
                                        toast.error('Google login failed!')
                                    }
                                }}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                            >
                                <FcGoogle size={30} />
                            </div>
                            <div
                                onClick={async () => {
                                    const result = await signIn('github', {
                                        callbackUrl: '/',
                                        redirect: false,
                                    })

                                    if (result?.ok) {
                                        toast.success('Logged in with GitHub!')
                                    } else {
                                        toast.error('GitHub login failed!')
                                    }
                                }}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                            >
                                <FaGithub size={30} />
                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12 ">
                            {variant === 'login'
                                ? 'First time using Netflix?'
                                : 'Already have an account?'}
                            <span
                                onClick={toggleVariant}
                                className="text-white ml-1 hover:underline cursor-pointer"
                            >
                                {variant === 'login'
                                    ? 'Create an account'
                                    : 'Login'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth
