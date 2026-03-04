'use client'

import { useState } from 'react'
import Link from 'next/link'
import HamburgerMenu from '@/components/HamburgerMenu'
import ProfileDropdown from '@/components/ProfileDropdown'

interface NavbarProps {
    title?: string
}

export default function Navbar({ title = "" }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    return (
        <>
            <nav className="bg-white shadow-md">
                <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
                    {/* Hamburger Menu - Left */}
                    <HamburgerMenu
                        isOpen={mobileMenuOpen}
                        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                    />

                    {/* Logo/Brand - Center */}
                    <div className="flex-1 text-center">
                        <h1 className="text-xl font-bold text-blue-600">{title}</h1>
                    </div>

                    {/* Profile Dropdown - Right */}
                    <ProfileDropdown
                        isOpen={profileMenuOpen}
                        onToggle={() => setProfileMenuOpen(!profileMenuOpen)}
                        onClose={() => setProfileMenuOpen(false)}
                    />
                </div>
            </nav>

            {/* Side Panel Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Side Panel */}
                    <div className="absolute top-0 left-0 h-screen w-full md:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <p className="text-lg font-bold text-gray-900">Menu</p>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                aria-label="Close menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <nav className="p-4 space-y-2">
                            <Link
                                href="/dashboard"
                                className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/user/account"
                                className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Account
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}
