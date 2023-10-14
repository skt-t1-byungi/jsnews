import { getUser, hasRole } from '@/lib/auth'
import { editNewsQuery, getNewsArticleQuery } from '@/queries/news'
import { notFound, redirect } from 'next/navigation'
import { Form } from './components'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await getNewsArticleQuery({ id })
    const user = await getUser()
    if (!data || !user || data.authorId !== user.id || !hasRole(user, 'admin')) {
        notFound()
    }
    return (
        <Form
            action={async form => {
                'use server'
                await editNewsQuery({
                    id,
                    title: form.get('title') as string,
                    contents: form.get('contents') as string,
                })
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
            <button type="submit">수정</button>
        </Form>
    )
}
