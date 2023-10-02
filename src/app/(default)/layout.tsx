import { getUser } from '@/lib/auth'
import Link from 'next/link'
import { SignInBtn, SignOutBtn } from './components'
import React from 'react'

export default async function RootLayout({ children }: { children?: React.ReactNode }) {
    const user = await getUser()
    return (
        <>
            <nav>
                <Link href="/news">News</Link>
                {user ? (
                    <>
                        <Link href={`/u/${user.displayId}`}>프로필</Link>
                        <SignOutBtn>로그아웃</SignOutBtn>
                    </>
                ) : (
                    <SignInBtn>로그인</SignInBtn>
                )}
            </nav>
            <main>{children}</main>
        </>
    )
}
