import db, { q, news } from '@/db'
import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { range } from 'remeda'

const PAGE_SIZE = 18

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page || 1)
    const [total, data] = await Promise.all([totalQuery(), dataQuery(page)])
    if (page > 1 && data.length === 0) {
        notFound()
    }
    const user = await getUser()
    return (
        <div>
            <ul>
                {data.map(news => (
                    <li key={news.id}>
                        <Link href={`/news/${news.id}`}>
                            <span>{news.title}</span>
                            <sub>{dayjs(news.createdAt).fromNow()}</sub>
                        </Link>
                    </li>
                ))}
            </ul>
            {user && <Link href="/news/write">Write</Link>}
            <Pagination total={total} current={page} />
        </div>
    )
}

function Pagination({ total, current }: { total: number; current: number }) {
    const WIDTH = 3
    const last = Math.ceil(total / PAGE_SIZE) || 1
    const start = Math.min(Math.floor((current - 1) / WIDTH) * WIDTH + 1, last - WIDTH + 1)
    const end = start + WIDTH - 1
    return (
        <div>
            {start > 1 && <Link href="/news">처음</Link>}
            {current > 1 && <Link href={`/news?page=${current - 1}`}>이전</Link>}
            {range(start, end + 1).map(i => (
                <Link key={i} href={`/news?page=${i}`}>
                    {i === current ? <b>{i}</b> : <span>{i}</span>}
                </Link>
            ))}
            {current < last && <Link href={`/news?page=${current + 1}`}>다음</Link>}
            {end < last && <Link href={`/news?page=${last}`}>마지막</Link>}
        </div>
    )
}

const totalQuery = () =>
    db
        .select({ count: q.sql<number>`COUNT(*)` })
        .from(news)
        .where(q.isNull(news.deletedAt))
        .then(res => res[0].count)

const dataQuery = (page: number) =>
    db.query.news.findMany({
        columns: {
            id: true,
            title: true,
            createdAt: true,
        },
        orderBy: [q.desc(news.createdAt)],
        where: q.isNull(news.deletedAt),
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
    })
