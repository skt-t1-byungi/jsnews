import db, { newsComments, q } from '@/db'
import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import { revalidatePath } from 'next/cache'

export default async function Page({ params }: { params: { id: string } }) {
    const id = Number(params.id)
    const [data, user] = await Promise.all([
        db.query.newsComments.findMany({
            where: q.and(q.eq(newsComments.newsId, id), q.isNull(newsComments.deletedAt)),
            with: {
                author: true,
            },
            orderBy: [
                q.asc(q.sql`COALESCE(${newsComments.parentId}, ${newsComments.id})`),
                newsComments.depth,
                q.desc(newsComments.createdAt),
            ],
        }),
        getUser(),
    ])
    return (
        <>
            <ul>
                {data.map(comment => (
                    <li key={comment.id}>
                        <div>{comment.contents}</div>
                        <div>
                            {comment.author.name} {dayjs(comment.createdAt).fromNow()}
                        </div>
                    </li>
                ))}
            </ul>
            {user && (
                <form
                    action={async (form: FormData) => {
                        'use server'
                        await db.insert(newsComments).values({
                            contents: form.get('contents') as string,
                            authorId: user.id,
                            newsId: id,
                        })
                        revalidatePath(`/news/${id}`)
                    }}
                >
                    <label>
                        <span>comment: </span>
                        <textarea name="contents"></textarea>
                    </label>
                    <button type="submit">작성</button>
                </form>
            )}
        </>
    )
}
