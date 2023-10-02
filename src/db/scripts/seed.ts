import { loadEnvConfig } from '@next/env'
import { faker } from '@faker-js/faker'
import { faker as koFaker } from '@faker-js/faker/locale/ko'
import { range, sample, times } from 'remeda'

loadEnvConfig(process.cwd(), true)

main()

async function main() {
    const { default: db, news, users, q } = await import('../index')

    await db.execute(q.sql`set foreign_key_checks=0;`)
    await db.execute(q.sql`TRUNCATE TABLE oauth_accounts`)
    await db.execute(q.sql`TRUNCATE TABLE news`)
    await db.execute(q.sql`TABLE users;`)
    await db.execute(q.sql`set foreign_key_checks=1;`)
    console.log('Truncated tables')

    let affected = await db.insert(users).values(
        times(10, () => ({
            avatar: faker.image.avatar(),
            displayId: faker.internet.userName(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
        })),
    )
    console.log(`Inserted ${affected[0].affectedRows} users`)

    const userId = affected[0].insertId
    const userIds = range(userId, userId + 10)
    affected = await db.insert(news).values(
        times(100, () => ({
            authorId: sample(userIds, 1)[0]!,
            title: koFaker.lorem.sentence(),
            contents: koFaker.lorem.paragraphs({
                min: 3,
                max: 50,
            }),
            createdAt: faker.date.recent({ days: 30 }),
        })),
    )
    console.log(`Inserted ${affected[0].affectedRows} news`)
    process.exit(0)
}
