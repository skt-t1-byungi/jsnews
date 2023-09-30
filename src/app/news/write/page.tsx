import db from '@/db'
import { Form } from './components'
import { news } from '@/db/schema'
import { redirect } from 'next/navigation'

export default function Page() {
    return (
        <Form
            action={async (form: FormData) => {
                'use server'
                await db.insert(news).values({
                    title: form.get('title') as string,
                    contents: form.get('contents') as string,
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
