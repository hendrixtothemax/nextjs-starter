"use client"

import React, { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { uploadProfileAvatar } from "@/lib/storage/profile_avatar_upload"

type Props = {
  initialFirstName: string
  initialLastName: string
  initialEmail: string
  userId: string
}

export default function AccountForm({
  initialFirstName,
  initialLastName,
  initialEmail,
  userId,
}: Props) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName, setLastName] = useState(initialLastName)
  const [email, setEmail] = useState(initialEmail)
  const [selectedFile, setSelectedFile] = useState<File | null>(null) // Added state for file
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const supabase = createSupabaseClient()

      // 1. Handle Avatar Upload if a file was selected
      if (selectedFile) {
        await uploadProfileAvatar(selectedFile, userId)
      }

      // 2. Update email if changed
      if (email !== initialEmail) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) throw emailError
      }

      // 3. Update profile fields
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", userId)

      if (profileError) throw profileError

      setMessage("Profile updated successfully.")
      setSelectedFile(null) // Clear the selection after success
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input
              className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input
              className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Avatar Upload
          </label>
          <input
            className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="file"
            accept="image/jpeg, image/jpg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]) // Only set state, don't upload
              }
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>

        {message && <div className="mt-4 text-sm text-green-600">{message}</div>}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
      </form>
    </div>
  )
}