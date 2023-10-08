'use client'

export function Form({
    children,
    action,
}: {
    children: React.ReactNode
    action?: (form: FormData) => Promise<void>
}) {
    return <form action={action}>{children}</form>
}
