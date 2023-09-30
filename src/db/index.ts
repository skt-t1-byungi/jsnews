import * as schema from './schema'
import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2'

export default drizzle(createPool('mysql://jsnews:jsnews@localhost:3306/jsnews'), {
    schema,
    mode: 'default',
})

export * as q from 'drizzle-orm'
