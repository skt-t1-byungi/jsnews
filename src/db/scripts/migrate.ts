import { loadEnvConfig } from '@next/env'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import path from 'node:path'

loadEnvConfig(process.cwd(), true)

main()

async function main() {
    const { default: db } = await import('../index')
    await migrate(db, {
        migrationsFolder: path.resolve(__dirname, '../migrations'),
    }).catch(err => {
        console.log(err.message)
        process.exit(0)
    })
}
