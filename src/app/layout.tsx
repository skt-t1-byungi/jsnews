import Link from 'next/link'

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <nav>
                    <Link href="/news">News</Link>
                </nav>
                {children}
            </body>
        </html>
    )
}
