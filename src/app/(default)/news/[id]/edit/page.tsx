import db, { q, news } from '@/db'
import { Form } from './components'
import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await db.query.news.findFirst({
        where: q.and(q.eq(news.id, id), q.isNull(news.deletedAt)),
        with: { author: true },
    })
    if (!data || data.authorId !== (await getUser())?.id) {
        notFound()
    }
    return (
        <Form
            action={async form => {
                'use server'
                await db
                    .update(news)
                    .set({
                        title: form.get('title') as string,
                        contents: form.get('contents') as string,
                    })
                    .where(q.eq(news.id, id))
                redirect(`/news/${id}`)
            }}
        >
            <label>
                <span>제목</span>
                <input type="text" name="title" defaultValue={data.title} />
            </label>
            <label>
                <span>내용</span>
                <textarea name="contents" defaultValue={data.contents} />
            </label>
            <button type="submit">수정</button>{' '}
        </Form>
    )
}
