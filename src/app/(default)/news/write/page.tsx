import db, { news, q } from '@/db'
import { getUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { Form } from './components'
import dayjs from 'dayjs'

export default async function Page() {
    const user = await getUser()
    if (!user) {
        notFound()
    }
    return (
        <Form
            action={async form => {
                'use server'
                const isTooMany = await db
                    .select({ count: q.sql<number>`COUNT(*)` })
                    .from(news)
                    .where(
                        q.and(
                            q.eq(news.authorId, user.id),
                            q.gte(news.createdAt, dayjs().subtract(30, 'second').toDate()),
                        ),
                    )
                    .then(rows => rows[0].count >= 5)
                if (isTooMany) {
                    throw new Error('Too many')
                }
                await db.insert(news).values({
                    title: form.get('title') as string,
                    contents: form.get('contents') as string,
                    authorId: user.id,
                })
                redirect('/news')
            }}
        >
            <label>
                <span>제목</span>
                <input type="text" name="title" />
            </label>
            <label>
                <span>내용</span>
                <textarea name="contents"></textarea>
            </label>
            <button type="submit">작성</button>
        </Form>
    )
}
