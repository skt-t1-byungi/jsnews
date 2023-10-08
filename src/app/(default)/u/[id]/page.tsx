import db, { q, users } from '@/db'
import { getUser } from '@/lib/auth'
import { QueryError } from 'mysql2'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const data = await db.query.users.findFirst({
        where: q.eq(users.displayId, params.id),
    })
    if (!data) {
        notFound()
    }
    const isOwner = data.id === (await getUser())?.id
    return (
        <div>
            <h1>
                {isOwner ? (
                    <form
                        action={async form => {
                            'use server'
                            try {
                                await db
                                    .update(users)
                                    .set({ displayId: form.get('displayId') as string })
                                    .where(q.eq(users.id, data.id))
                            } catch (err) {
                                if ((err as QueryError)?.code === 'ER_DUP_ENTRY') {
                                    throw new Error('Duplicated')
                                }
                                throw new Error('Unknown')
                            }
                            redirect(`/u/${form.get('displayId')}`)
                        }}
                    >
                        <input
                            type="text"
                            name="displayId"
                            defaultValue={data.displayId}
                            minLength={4}
                            maxLength={60}
                        />
                        <button type="submit">수정</button>
                    </form>
                ) : (
                    data.displayId
                )}
            </h1>
            <p>
                {isOwner ? (
                    <form
                        action={async form => {
                            'use server'
                            await db
                                .update(users)
                                .set({ name: form.get('name') as string })
                                .where(q.eq(users.id, data.id))
                        }}
                    >
                        <input
                            type="text"
                            name="name"
                            defaultValue={data.name}
                            minLength={2}
                            maxLength={100}
                        />
                        <button type="submit">수정</button>
                    </form>
                ) : (
                    data.name
                )}
            </p>
            <p>{data.email}</p>
        </div>
    )
}
