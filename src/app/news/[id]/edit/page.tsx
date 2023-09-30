import db, { q } from '@/db'
import { Form } from './components'
import { news } from '@/db/schema'
import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await db.query.news.findFirst({
        where: q.eq(news.id, id),
        with: { author: true },
    })
    if (!data || data.authorId !== (await getUser())?.id) {
        notFound()
    }
    return (
        <Form
            action={async (formData: FormData) => {
                'use server'
                await db
                    .update(news)
                    .set({
                        title: formData.get('title') as string,
                        contents: formData.get('contents') as string,
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
