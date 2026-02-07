import Link from 'next/link'

interface ProfileDropdownProps {
    isOpen: boolean
    onToggle: () => void
    onClose: () => void
}

export default function ProfileDropdown({ isOpen, onToggle, onClose }: ProfileDropdownProps) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center overflow-hidden"
                aria-label="User menu"
            >
                {/* Placeholder for profile picture - using initials */}
                <span className="text-white font-bold text-sm">AH</span>
            </button>

            {/* Profile Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Alexander Hendrix</p>
                        <p className="text-xs text-gray-500">user@example.com</p>
                    </div>
                    <div className="py-2">
                        <Link
                            href="/dashboard/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                            onClick={onClose}
                        >
                            Edit Profile
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                            onClick={onClose}
                        >
                            Settings
                        </Link>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                            onClick={() => {
                                onClose()
                                // Add logout logic here
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
