'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export function SignInBtn({ provider = 'github', children }: { children?: React.ReactNode; provider?: 'github' }) {
    const params = useSearchParams()
    return (
        <button onClick={() => signIn(provider, { callbackUrl: params.get('callbackUrl') ?? undefined })}>
            {children}
        </button>
    )
}
