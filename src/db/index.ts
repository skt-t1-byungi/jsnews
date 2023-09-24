import * as schema from './schema'
import { drizzle } from 'drizzle-orm/mysql2'
import { createPool } from 'mysql2/promise'

export default drizzle(createPool('mysql://jsnews:jsnews@db:3306/jsnews'), {
    schema,
    mode: 'default',
})
