import * as schema from './schema'
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2'

export default (global.$$db as MySql2Database<typeof schema>) ??= drizzle(
    createPool({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    }),
    {
        schema,
        mode: 'default',
    },
)

export * as q from 'drizzle-orm'
