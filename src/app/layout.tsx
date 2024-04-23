import { Poiret_One } from 'next/font/google'

const poiretOne = Poiret_One({
    weight: '400',
    variable: '--font-poiret-one',
    subsets: ['latin'],
})

import './global.css'

export const metadata = {
    title: 'JS News',
}

export default function RootLayout({ children }: { children?: React.ReactNode }) {
    return (
        <html className={poiretOne.variable} lang="ko">
            <body className="bg-concrete-100">{children}</body>
        </html>
    )
}
