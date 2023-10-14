import 'server-only'

import dayjs from 'dayjs'
import db, { q } from '../db'
import { news } from '../db/schema'

export function getNewsQuery(arg: { id: number }) {
    return db.query.news.findFirst({
        where: q.and(q.eq(news.id, arg.id), q.isNull(news.deletedAt)),
        with: { author: true },
    })
}

export function getPagedNewsQuery(arg: { page: number; perPage: number }) {
    return db
        .select({
            id: news.id,
            title: news.title,
            createdAt: news.createdAt,
            total: q.sql<number>`COUNT(*) OVER()`,
        })
        .from(news)
        .where(q.isNull(news.deletedAt))
        .orderBy(q.desc(news.createdAt))
        .limit(arg.perPage)
        .offset((arg.page - 1) * arg.perPage)
}

export async function writeNewsQuery(arg: { authorId: number; title: string; contents: string }) {
    const isTooMany = await db
        .select({ count: q.sql<number>`COUNT(*)` })
        .from(news)
        .where(
            q.and(
                q.eq(news.authorId, arg.authorId),
                q.gte(news.createdAt, dayjs().subtract(30, 'second').toDate()),
            ),
        )
        .then(rows => rows[0].count >= 5)
    if (isTooMany) {
        throw new Error('Too many')
    }
    await db.insert(news).values({
        title: arg.title,
        contents: arg.contents,
        authorId: arg.authorId,
    })
}

export function editNewsQuery(arg: { id: number; title: string; contents: string }) {
    return db
        .update(news)
        .set({ title: arg.title, contents: arg.contents })
        .where(q.eq(news.id, arg.id))
}

export function deleteNewsQuery(arg: { id: number }) {
    return db.update(news).set({ deletedAt: new Date() }).where(q.eq(news.id, arg.id))
}
