import { getUser } from '@/lib/auth'
import { editUserQuery, getUserByDisplayIdQuery } from '@/queries/users'
import { QueryError } from 'mysql2'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
    const data = await getUserByDisplayIdQuery({ displayId: params.id })
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
                                await editUserQuery({
                                    id: data.id,
                                    displayId: form.get('displayId') as string,
                                })
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
                            await editUserQuery({
                                id: data.id,
                                name: form.get('name') as string,
                            })
                            revalidatePath(`/u/${data.displayId}`)
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
