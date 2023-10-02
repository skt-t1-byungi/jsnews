import { notFound, redirect } from 'next/navigation'
import db, { q, news } from '@/db'
import dayjs from '@/lib/dayjs'
import { Delete } from './components'
import { getUser } from '@/lib/auth'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await db.query.news.findFirst({
        where: q.eq(news.id, id),
        with: { author: true },
    })
    if (!data) {
        notFound()
    }
    const user = await getUser()
    return (
        <div>
            <h1>{data.title}</h1>
            <p>{dayjs(data.createdAt).fromNow()}</p>
            <div>{data.contents}</div>
            <p>작성자: {data.author.name}</p>
            <a href="/news">목록</a>
            {data.authorId === user?.id && (
                <>
                    <a href={`/news/${id}/edit`}>수정</a>
                    <Delete
                        action={async () => {
                            'use server'
                            await db
                                .update(news)
                                .set({ deletedAt: q.sql`CURRENT_TIMESTAMP` })
                                .where(q.eq(news.id, id))
                            redirect('/news')
                        }}
                    />
                </>
            )}
        </div>
    )
}
