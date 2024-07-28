import { useCallback, useEffect, useState } from 'react'
import MobileMenu from './MobileMenu'
import NavbarItem from './NavbarItem'
import AccountMenu from './AccountMenu'
import { BsBell, BsChevronDown, BsSearch } from 'react-icons/bs'

const TOP_OFFSET = 66

const NavBar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false)
    const [showAccountMenu, setShowAccountMenu] = useState(false)
    const [showBackground, setShowBackground] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= TOP_OFFSET) {
                setShowBackground(true)
            } else {
                setShowBackground(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current)
    }, [])

    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current)
    }, [])

    return (
        <nav className="w-full fixed z-40">
            <div
                className={`px-4 md:px-16 py-6 flex items-center transition duration-500 ${
                    showBackground ? 'bg-zinc-900 bg-opacity-90' : ''
                }`}
            >
                {/* Cột 1: Logo */}
                <div className="flex-1">
                    <img
                        className="h-4 lg:h-7"
                        src="/images/logo.png"
                        alt="logo"
                    />
                </div>

                {/* Cột 2: Tìm kiếm */}
                {/* <div className="flex-none flex items-center space-x-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-8 pr-4 py-2 border border-gray-400 rounded-md bg-transparent text-gray-200 focus:outline-none"
                        />
                        <BsSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div> */}

                {/* Cột 3: Tài khoản và Dashboard */}
                <div className="flex-1 flex justify-end items-center gap-7">
                    {/* <div className="text-gray-200 hover:text-gray-300 cursor-pointer transition">
                        Dashboard
                    </div> */}
                    <div
                        onClick={toggleAccountMenu}
                        className="flex flex-row items-center gap-2 cursor-pointer relative"
                    >
                        <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden">
                            <img src="/images/default-blue.png" alt="" />
                        </div>
                        <BsChevronDown
                            className={`text-white transition ${
                                showAccountMenu ? 'rotate-180' : 'rotate-0'
                            }`}
                        />
                        <AccountMenu visible={showAccountMenu} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
