
import AccountForm from '@/components/AccountForm'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbars/Navbar'

export default async function Page() {
	const supabase = await createClient()

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	if (!user) {
		return <div className="min-h-screen bg-gray-100">Please sign in to view your account.</div>
	}

	const { data: profile } = await supabase.from('profiles').select('first_name,last_name').eq('id', user.id).single()

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Account</h1>
				</div>

				<AccountForm
					initialFirstName={profile?.first_name ?? ''}
					initialLastName={profile?.last_name ?? ''}
					initialEmail={user.email ?? ''}
					userId={user.id}
				/>
			</div>
		</div>
	)
}

