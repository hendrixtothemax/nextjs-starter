'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase/client'

interface ProfileData {
  first_name: string
  last_name: string
  email: string
}

interface ProfileDropdownProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export default function ProfileDropdown({
  isOpen,
  onToggle,
  onClose,
}: ProfileDropdownProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      try {
        const supabase = createSupabaseClient()
        
        // 1. Get the authenticated user session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) return

        // 2. Fetch the specific profile row from public.profiles
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          setProfile(data)
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : '??'

  const fullName = loading 
    ? 'Loading...' 
    : profile 
      ? `${profile.first_name} ${profile.last_name}` 
      : 'Guest User'

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center overflow-hidden"
        aria-label="User menu"
      >
        <span className="text-white font-bold text-sm">
          {loading ? '...' : initials}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{fullName}</p>
            {!loading && profile && (
              <p className="text-xs text-gray-500">{profile.email}</p>
            )}
          </div>

          <div className="py-2">
            <Link
              href="/user/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              onClick={onClose}
            >
              Edit Profile
            </Link>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              onClick={async () => {
                onClose()
                const supabase = createSupabaseClient()
                await supabase.auth.signOut()
                window.location.href = '/login'
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