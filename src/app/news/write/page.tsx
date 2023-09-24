import db from '@/db'
import { WriteForm } from './components'
import { news } from '@/db/schema'
import { redirect } from 'next/navigation'

export default function Page() {
    return (
        <WriteForm
            action={async (form: FormData) => {
                'use server'
                await db.insert(news).values({
                    title: form.get('title') as string,
                    contents: form.get('contents') as string,
                })
                redirect('/news')
            }}
        />
    )
}
