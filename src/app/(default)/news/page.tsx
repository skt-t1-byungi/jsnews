import Pagination from '@/components/Pagination'
import { getUser } from '@/lib/auth'
import dayjs from '@/lib/dayjs'
import { getPagedNewsQuery } from '@/queries/news'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const PER_PAGE = 18

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page ?? 1)
    const data = await getPagedNewsQuery({ page, perPage: PER_PAGE })
    if (page > 1 && data.length === 0) {
        notFound()
    }
    const total = data[0]?.total ?? 0
    const user = await getUser()
    return (
        <div className="mx-auto max-w-container">
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
            <Pagination total={total} current={page} baseUrl="/news" perPage={PER_PAGE} />
        </div>
    )
}
