import './global.css'

export const metadata = {
    title: 'JS News',
}

export default function RootLayout({ children }: { children?: React.ReactNode }) {
    return (
        <html>
            <body className="bg-concrete-100">{children}</body>
        </html>
    )
}
