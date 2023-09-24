import { char, int, mysqlTable, text, timestamp } from 'drizzle-orm/mysql-core'

export const news = mysqlTable('news', {
    id: int('id').autoincrement().primaryKey(),
    title: char('title', { length: 255 }).notNull(),
    contents: text('contents').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})
