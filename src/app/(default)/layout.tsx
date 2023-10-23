import { getUser } from '@/lib/auth'
import Link from 'next/link'
import { SignInLink, SignOutBtn } from './components'

export default async function Layout({ children }: { children?: React.ReactNode }) {
    const user = await getUser()
    return (
        <>
            <header className="font-brand mb-8 flex h-16 justify-center gap-4">
                <div className="flex w-full max-w-4xl items-center justify-start">
                    <Link href="/" className="whitespace-nowrap text-2xl font-bold">
                        JSnews
                    </Link>
                    <nav className="ml-28 flex w-full gap-4 text-xl">
                        <Link href="/news" className="mr-auto">
                            news
                        </Link>
                        {user ? (
                            <>
                                <Link href="/me">profile</Link>
                                <SignOutBtn>logout</SignOutBtn>
                            </>
                        ) : (
                            <SignInLink>login</SignInLink>
                        )}
                    </nav>
                </div>
            </header>
            <main>{children}</main>
        </>
    )
}
