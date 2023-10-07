import db, { newsComments, q } from '@/db'
import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import { unflatten } from 'flat'
import { revalidatePath } from 'next/cache'
import { FoldableCommentForm } from './components'

export default async function Page({ params }: { params: { id: string } }) {
    const newsId = Number(params.id)
    const [data, user] = await Promise.all([dataQuery(newsId), getUser()])
    return (
        <>
            <ul>
                {data.map(comment => (
                    <li
                        key={comment.id}
                        style={{
                            marginLeft: `${comment.depth * 30}px`,
                        }}
                    >
                        <div>{comment.contents}</div>
                        <div>{dayjs.utc(comment.createdAt).fromNow()}</div>
                        <div>{comment.author.name}</div>
                        <div>
                            {user && (
                                <FoldableCommentForm
                                    action={async form => {
                                        'use server'
                                        await writeCommentQuery({
                                            newsId,
                                            parentId: comment.id,
                                            contents: form.get('contents') as string,
                                            authorId: user.id,
                                            depth: comment.depth + 1,
                                        })
                                        revalidatePath(`/news/${newsId}`)
                                    }}
                                />
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {user && (
                <form
                    action={async form => {
                        'use server'
                        await writeCommentQuery({
                            newsId,
                            contents: form.get('contents') as string,
                            authorId: user.id,
                        })
                        revalidatePath(`/news/${newsId}`)
                    }}
                >
                    <label>
                        <span>comment: </span>
                        <textarea name="contents" />
                    </label>
                    <button type="submit">작성</button>
                </form>
            )}
        </>
    )
}

async function dataQuery(newsId: number) {
    const result = await db.execute(q.sql`
     WITH RECURSIVE recur AS (
        SELECT parent_id, id, depth, CAST(LPAD(index_in_news, 10, '0') as CHAR(9999)) as path
        FROM news_comments
        WHERE news_id = ${q.sql.raw(String(newsId))} and depth = 0
        UNION ALL
        SELECT c.parent_id, c.id, c.depth, CONCAT(r.path, '.', LPAD(index_in_news, 10, '0')) as path
        FROM news_comments c
        JOIN recur r ON c.parent_id = r.id
        WHERE c.depth = r.depth + 1
     )
     SELECT 
        c.id,
        c.contents,
        c.created_at,
        c.updated_at,
        c.depth,
        r.path,
        u.id as "author.id",
        u.name as "author.name",
        u.email as "author.email",
        u.avatar as "author.avatar",
        u.display_id as "author.displayId"
     FROM recur r 
     Inner JOIN news_comments c ON r.id = c.id
     Inner JOIN users u ON author_id = u.id
     ORDER BY r.path;`)
    return ((result[0] ?? []) as any).map(unflatten) as {
        id: number
        depth: number
        contents: string
        createdAt: string
        updatedAt?: string
        author: {
            id: number
            name: string
            email: string
            avatar: string
            displayId: string
        }
    }[]
}

async function writeCommentQuery(arg: {
    newsId: number
    parentId?: number
    contents: string
    authorId: number
    depth?: number
}) {
    return db.insert(newsComments).values({
        contents: arg.contents,
        authorId: arg.authorId,
        newsId: arg.newsId,
        depth: arg.depth ?? 0,
        indexInNews: await db
            .select({
                count: q.sql<number>`COUNT(*)`,
            })
            .from(newsComments)
            .where(q.eq(newsComments.newsId, arg.newsId))
            .then(([h]) => h.count!),
        ...(arg.parentId && { parentId: arg.parentId }),
    })
}
