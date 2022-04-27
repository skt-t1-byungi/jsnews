import '../tailwind.css'

import type { AppProps } from 'next/app'
import { RelayPageProvider } from '../libs/relay-tools'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <RelayPageProvider pageProps={pageProps}>
            <Component {...pageProps} />
        </RelayPageProvider>
    )
}
