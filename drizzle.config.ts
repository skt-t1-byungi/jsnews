import type { Config } from 'drizzle-kit'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd(), true)

export default {
    schema: 'src/db/schema.ts',
    out: 'src/db/migrations',
    driver: 'mysql2',
    dbCredentials: {
        host: process.env.DB_HOST!,
        database: process.env.DB_DATABASE!,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    },
} satisfies Config
