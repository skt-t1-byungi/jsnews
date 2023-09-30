import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { SignInBtn, SignOutBtn } from './components'
import React from 'react'

export default async function RootLayout({ children }: { children?: React.ReactNode }) {
    const session = await getSession()
    return (
        <html>
            <body>
                <nav>
                    <Link href="/news">News</Link>
                    {session ? (
                        <>
                            <SignOutBtn>로그아웃</SignOutBtn>
                        </>
                    ) : (
                        <SignInBtn>로그인</SignInBtn>
                    )}
                </nav>
                {children}
            </body>
        </html>
    )
}
