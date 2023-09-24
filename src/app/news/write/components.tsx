'use client'

export function WriteForm({ action }: { action: (form: FormData) => Promise<void> }) {
    return (
        <form action={action}>
            <label>
                <span>제목</span>
                <input type="text" name="title" />
            </label>
            <label>
                <span>내용</span>
                <textarea name="contents"></textarea>
            </label>
            <button type="submit">작성</button>
        </form>
    )
}
