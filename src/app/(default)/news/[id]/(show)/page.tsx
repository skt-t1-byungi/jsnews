import { notFound, redirect } from 'next/navigation'
import dayjs from '@/lib/dayjs'
import { getUser } from '@/lib/auth'
import { deleteNewsQuery, getNewsQuery } from '@/queries/news'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await getNewsQuery({ id })
    if (!data) {
        notFound()
    }
    const user = await getUser()
    return (
        <article>
            <h1>{data.title}</h1>
            <p>{dayjs(data.createdAt).fromNow()}</p>
            <div>{data.contents}</div>
            <p>작성자: {data.author.name}</p>
            <a href="/news">목록</a>
            {data.authorId === user?.id && (
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
