'use client'

import { useRouter } from 'next/router'

export function Delete({ action }: { action: () => Promise<void> }) {
    const router = useRouter()
    return (
        <button
            onClick={async () => {
                await action()
                confirm('삭제되었습니다.')
                router.push('/news')
            }}
        >
            삭제
        </button>
    )
}
