import Link from 'next/link'
import { range } from 'remeda'

export default function Pagination({
    total,
    current,
    perPage,
    baseUrl,
    width = 3,
}: {
    total: number
    current: number
    perPage: number
    baseUrl: string
    width?: number
}) {
    const last = Math.ceil(total / perPage) || 1
    const start = Math.max(Math.min(current - Math.floor(width / 2), last - width + 1), 1)
    const end = Math.min(start + width - 1, last)
    return (
        <div>
            {start > 1 && <Link href={baseUrl}>처음</Link>}
            {current > 1 && <Link href={{ pathname: baseUrl, query: { page: current - 1 } }}>이전</Link>}
            {range(start, end + 1).map(i => (
                <Link key={i} href={{ pathname: baseUrl, query: { page: i } }}>
                    {i === current ? <b>{i}</b> : <span>{i}</span>}
                </Link>
            ))}
            {current < last && <Link href={{ pathname: baseUrl, query: { page: current + 1 } }}>다음</Link>}
            {end < last && <Link href={{ pathname: baseUrl, query: { page: last } }}>마지막</Link>}
        </div>
    )
}
