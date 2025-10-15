// app/unity-bridge/page.tsx
'use client'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function UnityBridge() {
  const { isLoaded, isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (!isLoaded) return
    ;(async () => {
      if (!isSignedIn) {
        // サインインしてなければサインインへ（戻り先はこのページ）
        const redirect = `${location.origin}/unity-bridge`
        location.href = `/sign-in?redirect_url=${encodeURIComponent(redirect)}`
        return
      }
      const token = await getToken({ /* template: 'unity' など任意 */ })
      const url = `unity-login://callback?token=${encodeURIComponent(token ?? '')}`
      location.href = url
    })()
  }, [isLoaded, isSignedIn, getToken])

  return <p>Finishing sign-in…</p>
}
