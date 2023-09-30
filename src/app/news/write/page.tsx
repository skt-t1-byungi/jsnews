import db from '@/db'
import { news } from '@/db/schema'
import { getUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { Form } from './components'

export default async function Page() {
    const user = await getUser()
    if (!user) {
        notFound()
    }
    return (
        <Form
            action={async (form: FormData) => {
                'use server'
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
