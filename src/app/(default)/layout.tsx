import { getUser } from '@/lib/auth'
import Link from 'next/link'
import { SignInLink, SignOutBtn } from './components'

export default async function Layout({ children }: { children?: React.ReactNode }) {
    const user = await getUser()
    return (
        <>
            <header className="flex h-14 justify-center gap-4 border-b-2 border-limed-spruce-900">
                <div className="flex w-full max-w-7xl items-center justify-start">
                    <Link href="/">JSNE.WS</Link>
                    <nav className="text-l4 ml-28 flex w-full gap-2">
                        <Link href="/news" className="mr-auto">
                            NEWS
                        </Link>
                        {user ? (
                            <>
                                <Link href="/me">프로필</Link>
                                <SignOutBtn>로그아웃</SignOutBtn>
                            </>
                        ) : (
                            <SignInLink>로그인</SignInLink>
                        )}
                    </nav>
                </div>
            </header>
            <main>{children}</main>
        </>
    )
}
