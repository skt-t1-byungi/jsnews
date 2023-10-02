'use client'

export function DeleteBtn({ action }: { action: () => Promise<void> }) {
    return <button onClick={() => action()}>삭제</button>
}
