import { notFound } from 'next/navigation'
import db from '@/db'
import dayjs from '@/lib/dayjs'
import { Delete } from './components'
import { news } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await db.query.news.findFirst({
        where: (news, q) => q.eq(news.id, id),
    })
    if (!data) {
        return notFound()
    }
    return (
        <div>
            <h1>{data.title}</h1>
            <p>{dayjs(data.createdAt).fromNow()}</p>
            <div>{data.contents}</div>
            <Delete
                action={async () => {
                    'use server'
                    await db.delete(news).where(eq(news.id, id))
                }}
            />
        </div>
    )
}
