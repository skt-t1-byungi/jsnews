'use client'

export function Delete({ action }: { action: () => Promise<void> }) {
    return <button onClick={() => action()}>삭제</button>
}
