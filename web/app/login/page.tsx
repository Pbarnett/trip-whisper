'use client'

import { supabase } from '@/lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()

  // if the user is already signed-in, skip
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/dashboard')
    })
    // listen for sign-in events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session) router.replace('/dashboard')
      }
    )
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
        redirectTo="/dashboard"
      />
    </div>
  )
}
