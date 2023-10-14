'use client'

import dayjs from '@/lib/dayjs'
import type { CommentData } from '@/queries/comments'
import { useState } from 'react'

export function Comment({
    data,
    replyAction,
    editAction,
    deleteAction,
}: {
    data: CommentData
    replyAction?: (form: FormData) => Promise<void>
    editAction?: (form: FormData) => Promise<void>
    deleteAction?: () => Promise<void>
}) {
    const [writeMode, setWriteMode] = useState<false | 'edit' | 'reply'>(false)
    return (
        <li
            style={{
                marginLeft: `${data.depth * 30}px`,
            }}
        >
            <div>
                {writeMode === 'edit' ? (
                    <WriteForm
                        defaultContents={data.contents}
                        action={async form => {
                            await editAction!(form)
                            setWriteMode(false)
                        }}
                    />
                ) : data.deletedAt ? (
                    <span>삭제됨</span>
                ) : (
                    data.contents
                )}
            </div>
            <div>{dayjs.utc(data.createdAt).fromNow()}</div>
            <div>{data.author.name}</div>
            {data.deletedAt || (
                <div>
                    <>
                        {replyAction && <button onClick={() => setWriteMode('reply')}>답글</button>}
                        {editAction && <button onClick={() => setWriteMode('edit')}>수정</button>}
                    </>
                    {deleteAction && (
                        <form action={deleteAction}>
                            <button>삭제</button>
                        </form>
                    )}
                </div>
            )}
            {writeMode === 'reply' && (
                <WriteForm
                    action={async form => {
                        await replyAction!(form)
                        setWriteMode(false)
                    }}
                />
            )}
        </li>
    )
}

export function WriteForm({
    action,
    defaultContents,
}: {
    action?: (form: FormData) => Promise<void>
    defaultContents?: string
}) {
    return (
        <form action={action}>
            <textarea name="contents" defaultValue={defaultContents} />
            <button type="submit">작성</button>
        </form>
    )
}
