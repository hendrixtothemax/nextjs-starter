'use client'

import Navbar from '@/components/Navbar'

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome back!</h2>
                <p className="text-gray-600">Click the hamburger menu or profile icon to explore the navbar functionality.</p>
            </div>
        </div>
    )
}