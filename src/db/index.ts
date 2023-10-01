import * as schema from './schema'
import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2'

function connect() {
    return drizzle(
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
}

export default process.env.NODE_ENV === 'production'
    ? connect()
    : ((
          globalThis as {
              $$db?: ReturnType<typeof connect>
          }
      ).$$db ??= connect())

export * as q from 'drizzle-orm'
export * from './schema'
