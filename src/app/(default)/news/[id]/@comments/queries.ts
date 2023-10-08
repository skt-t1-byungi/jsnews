import 'server-only'

import db, { newsComments, q } from '@/db'
import { unflatten } from 'flat'

export type CommentData = {
    id: number
    depth: number
    contents: string
    createdAt: string
    updatedAt?: string
    deletedAt?: string
    author: {
        id: number
        name: string
        email: string
        avatar: string
        displayId: string
    }
}

export async function dataQuery(newsId: number) {
    const result = await db.execute(q.sql`
     WITH RECURSIVE recur AS (
        SELECT parent_id, id, depth, CAST(LPAD(index_in_news, 5, '0') as CHAR(9999)) as path
        FROM news_comments
        WHERE news_id = ${newsId} and depth = 0 and hard_deleted = false
        UNION ALL
        SELECT c.parent_id, c.id, c.depth, CONCAT(r.path, '.', LPAD(index_in_news, 5, '0')) as path
        FROM recur r
        JOIN news_comments c ON c.parent_id = r.id and c.hard_deleted = false
     )
     SELECT 
        c.id,
        c.contents,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        c.depth,
        c.deleted_at as deletedAt,
        u.id as "author.id",
        u.name as "author.name",
        u.email as "author.email",
        u.avatar as "author.avatar",
        u.display_id as "author.displayId"
     FROM recur r 
     Inner JOIN news_comments c ON r.id = c.id
     Inner JOIN users u ON author_id = u.id
     ORDER BY r.path;`)
    return ((result[0] ?? []) as any).map(unflatten) as CommentData[]
}

export async function writeCommentQuery(arg: {
    newsId: number
    parentId?: number
    contents: string
    authorId: number
    depth?: number
}) {
    return db.transaction(async tx => {
        await tx.insert(newsComments).values({
            contents: arg.contents,
            authorId: arg.authorId,
            newsId: arg.newsId,
            depth: arg.depth ?? 0,
            indexInNews: await tx
                .select({ count: q.sql<number>`COUNT(*)` })
                .from(newsComments)
                .where(q.eq(newsComments.newsId, arg.newsId))
                .then(([h]) => h.count!),
            ...(arg.parentId && { parentId: arg.parentId }),
        })
    })
}

export function editCommentQuery(arg: { id: number; contents: string }) {
    return db
        .update(newsComments)
        .set({ contents: arg.contents })
        .where(q.eq(newsComments.id, arg.id))
}

export async function deleteCommentQuery(arg: { newsId: number; id: number }) {
    return db.transaction(async tx => {
        await tx
            .update(newsComments)
            .set({
                deletedAt: new Date(),
                hardDeleted: await tx
                    .select({ count: q.sql<number>`COUNT(*)` })
                    .from(newsComments)
                    .where(
                        q.and(
                            q.eq(newsComments.newsId, arg.newsId),
                            q.eq(newsComments.parentId, arg.id),
                            q.eq(newsComments.hardDeleted, false),
                        ),
                    )
                    .then(([h]) => !h.count),
            })
            .where(q.eq(newsComments.id, arg.id))
    })
}
