'use client'

export function Delete({ action }: { action: () => Promise<void> }) {
    return (
        <button
            onClick={async () => {
                await action()
                confirm('삭제되었습니다.')
                location.href = '/news'
            }}
        >
            삭제
        </button>
    )
}
