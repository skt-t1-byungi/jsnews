import db, { users, q } from '@/db'
import { pickBy } from 'remeda'

export function getUserByDisplayIdQuery(arg: { displayId: string }) {
    return db.query.users.findFirst({
        where: q.eq(users.displayId, arg.displayId),
    })
}

export function editUserQuery(arg: {
    id: number
    avatar?: string
    name?: string
    displayId?: string
}) {
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
