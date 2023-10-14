import { getUser } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'

export default async function Page() {
    const user = await getUser()
    if (user) {
        redirect(`/u/${user.displayId}`)
    } else {
        notFound()
    }
}
