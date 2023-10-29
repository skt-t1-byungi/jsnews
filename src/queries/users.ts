import db, { users, q, roles, Role } from '@/db'
import { pickBy } from 'remeda'

export function getUserByDisplayIdQuery(arg: { displayId: string }) {
    return db.query.users.findFirst({
        where: q.eq(users.displayId, arg.displayId),
    })
}

export function getPagedUsersQuery(arg: { page: number; perPage: number }) {
    return db.query.users.findMany({
        extras: {
            total: q.sql<number>`COUNT(*) OVER()`.as('total'),
        },
        with: {
            oauthAccounts: true,
            roles: true,
        },
        limit: arg.perPage,
        offset: (arg.page - 1) * arg.perPage,
        orderBy: q.desc(users.createdAt),
    })
}

export function editUserQuery(arg: { id: number; avatar?: string; name?: string; displayId?: string }) {
    return db
        .update(users)
        .set(
            pickBy(
                {
                    avatar: arg.avatar,
                    name: arg.name,
                    displayId: arg.displayId,
                },
                Boolean,
            ),
        )
        .where(q.eq(users.id, arg.id))
}

export function updateRolesQuery(arg: { id: number; roles: Role[] }) {
    return db.transaction(async tx => {
        await tx.delete(roles).where(q.and(q.eq(roles.userId, arg.id), q.notInArray(roles.name, arg.roles)))
        await tx
            .insert(roles)
            .values(arg.roles.map(name => ({ userId: arg.id, name })))
            .onDuplicateKeyUpdate({
                set: { id: q.sql`id` },
            })
    })
}
