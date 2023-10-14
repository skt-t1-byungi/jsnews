import { getUser, hasRole } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import { deleteNewsQuery, getNewsArticleQuery } from '@/queries/news'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await getNewsArticleQuery({ id })
    if (!data) {
        notFound()
    }
    const user = await getUser()
    const canEdit = hasRole(user, 'admin') || user?.id === data.author.id
    return (
        <article>
            <h1>{data.title}</h1>
            <p>{dayjs(data.createdAt).fromNow()}</p>
            <div>{data.contents}</div>
            <p>작성자: {data.author.name}</p>
            <a href="/news">목록</a>
            {canEdit && (
                <>
                    <a href={`/news/${id}/edit`}>수정</a>
                    <form>
                        <button
                            formAction={async () => {
                                'use server'
                                await deleteNewsQuery({ id })
                                redirect('/news')
                            }}
                        >
                            삭제
                        </button>
                    </form>
                </>
            )}
        </article>
    )
}
