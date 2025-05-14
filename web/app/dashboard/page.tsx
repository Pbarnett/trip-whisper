import { supabase } from '@/lib/supabaseClient'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  // server-side: read cookie and get user
  const supa = supabase
    .auth
    .setSession({ access_token: '', refresh_token: '' }) // dummy to satisfy types

  const {
    data: { user }
  } = await supa.auth.getUser()

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">Hello {user?.email}</h1>
    </main>
  )
}
