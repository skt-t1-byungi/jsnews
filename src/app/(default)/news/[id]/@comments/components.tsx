'use client'

import { useState } from 'react'

export function FoldableCommentForm({ action }: { action: (form: FormData) => Promise<void> }) {
    const [isOpened, setIsOpened] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpened(v => !v)}>{isOpened ? '접기' : '댓글작성'}</button>
            {isOpened && (
                <form
                    action={async form => {
                        await action(form)
                        setIsOpened(false)
                    }}
                >
                    <label>
                        <span>comment: </span>
                        <textarea name="contents" />
                    </label>
                    <button type="submit">작성</button>
                </form>
            )}
        </>
    )
}
