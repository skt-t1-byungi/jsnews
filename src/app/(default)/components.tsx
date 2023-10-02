'use client'

import { signIn, signOut } from 'next-auth/react'
import React from 'react'

export function SignInBtn({ children }: { children?: React.ReactNode }) {
    return <button onClick={() => signIn()}>{children}</button>
}

export function SignOutBtn({ children }: { children?: React.ReactNode }) {
    return <button onClick={() => signOut()}>{children}</button>
}
