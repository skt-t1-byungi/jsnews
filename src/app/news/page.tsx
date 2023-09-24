import db from '@/db'
import dayjs from '@/lib/dayjs'
import Link from 'next/link'

export default async function Page() {
    const news = await db.query.news.findMany({
        columns: {
            id: true,
            title: true,
            createdAt: true,
        },
        orderBy: (news, q) => [q.desc(news.createdAt)],
    })
    return (
        <div>
            <ul>
                {news.map(news => (
                    <li key={news.id}>
                        <a href={`/news/${news.id}`}>
                            <span>{news.title}</span>
                            <sub>{dayjs(news.createdAt).fromNow()}</sub>
                        </a>
                    </li>
                ))}
            </ul>
            <Link href="/news/write">Write</Link>
        </div>
    )
}
