import db, { q, news } from '@/db'
import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import Link from 'next/link'

export default async function Page() {
    const [data, user] = await Promise.all([
        db.query.news.findMany({
            columns: {
                id: true,
                title: true,
                createdAt: true,
            },
            orderBy: [q.desc(news.createdAt)],
            where: q.isNull(news.deletedAt),
        }),
        getUser(),
    ])
    return (
        <div>
            <ul>
                {data.map(news => (
                    <li key={news.id}>
                        <a href={`/news/${news.id}`}>
                            <span>{news.title}</span>
                            <sub>{dayjs(news.createdAt).fromNow()}</sub>
                        </a>
                    </li>
                ))}
            </ul>
            {user && <Link href="/news/write">Write</Link>}
        </div>
    )
}
