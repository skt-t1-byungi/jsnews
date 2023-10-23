import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import { getPagedNewsQuery } from '@/queries/news'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { range } from 'remeda'

const PAGE_SIZE = 18

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page || 1)
    const data = await getPagedNewsQuery({ page, perPage: PAGE_SIZE })
    if (page > 1 && data.length === 0) {
        notFound()
    }
    const total = data[0]?.total ?? 0
    const user = await getUser()
    return (
        <div className="max-w-container mx-auto">
            <ul className="grid grid-cols-2 gap-8">
                {data.map(news => (
                    <li
                        key={news.id}
                        className="h-[160px] overflow-hidden rounded-xl border-2 border-concrete-600 bg-white"
                    >
                        <Link href={`/news/${news.id}`} className="flex h-full items-stretch">
                            <img
                                src={`https://picsum.photos/200?random=${news.id}`}
                                alt="thumbnail"
                                className="object-cover"
                            />
                            <div className="p-4">
                                <span>{news.title}</span>
                                <sub>{dayjs(news.createdAt).fromNow()}</sub>
                            </div>
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
    const start = Math.max(Math.min(Math.floor((current - 1) / WIDTH) * WIDTH + 1, last - WIDTH + 1), 1)
    const end = Math.min(start + WIDTH - 1, last)
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
