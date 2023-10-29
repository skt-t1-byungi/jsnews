import { getUser, hasRole } from '@/lib/auth'
import { getPagedUsersQuery, updateRolesQuery } from '@/queries/users'
import dayjs from '@/lib/dayjs'
import Pagination from '@/components/Pagination'
import { Role } from '@/db'
import { revalidatePath } from 'next/cache'

const PER_PAGE = 6
const ROLES = ['admin', 'reporter'] as const

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
    const page = Number(searchParams.page || 1)
    const [user, users] = await Promise.all([getUser(), getPagedUsersQuery({ page, perPage: PER_PAGE })])
    const total = users[0]?.total ?? 0
    return (
        <>
            <h1>Users</h1>
            <table className="table-fixed">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>email</th>
                        <th>linked sns</th>
                        <th>createdAt</th>
                        <th>roles</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => {
                        return (
                            <tr key={u.id} className="border-b border-gray-300">
                                <td className="p-2">{u.id}</td>
                                <td className="p-2">{u.name}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.oauthAccounts.map(u => u.provider).join(', ')}</td>
                                <td className="p-2">{dayjs(u.createdAt).format('YYYY-MM-DD')}</td>
                                <td className="p-2">
                                    <form
                                        action={async form => {
                                            'use server'
                                            await updateRolesQuery({
                                                id: u.id,
                                                roles: form.getAll('roles') as Role[],
                                            })
                                            revalidatePath('/admin/users')
                                        }}
                                    >
                                        {ROLES.map(role => {
                                            const selfAdmin = role === 'admin' && u.id === user?.id
                                            return (
                                                <label key={role} className="block">
                                                    {selfAdmin && <input type="hidden" name="roles" value={role} />}
                                                    <input
                                                        disabled={selfAdmin}
                                                        className="mr-1"
                                                        type="checkbox"
                                                        name="roles"
                                                        value={role}
                                                        defaultChecked={hasRole(u, role)}
                                                    />
                                                    {role}
                                                </label>
                                            )
                                        })}
                                        <button className="mr-1">저장</button>
                                    </form>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination total={total} current={page} baseUrl="/admin/users" perPage={PER_PAGE} />
        </>
    )
}
