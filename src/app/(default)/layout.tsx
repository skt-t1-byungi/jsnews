import { getUser } from '@/lib/auth'
import Link from 'next/link'
import { SignInLink, SignOutBtn } from './components'

export default async function Layout({ children }: { children?: React.ReactNode }) {
    const user = await getUser()
    return (
        <>
            <nav>
                <Link href="/news">News</Link>
                {user ? (
                    <>
                        <Link href="/me">프로필</Link>
                        <SignOutBtn>로그아웃</SignOutBtn>
                    </>
                ) : (
                    <SignInLink>로그인</SignInLink>
                )}
            </nav>
            <main>{children}</main>
        </>
    )
}
