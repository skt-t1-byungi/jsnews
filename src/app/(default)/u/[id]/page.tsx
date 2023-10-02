import db, { q, users } from '@/db'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const data = await db.query.users.findFirst({
        where: q.eq(users.displayId, params.id),
    })
    if (!data) {
        notFound()
    }
    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.displayId}</p>
            <p>{data.email}</p>
        </div>
    )
}
