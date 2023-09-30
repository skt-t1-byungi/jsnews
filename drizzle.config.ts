import type { Config } from 'drizzle-kit'

export default {
    schema: 'src/db/schema.ts',
    out: 'src/db/migrations',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: 'mysql://jsnews:jsnews@localhost:3306/jsnews',
    },
} satisfies Config
