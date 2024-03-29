import { relations } from 'drizzle-orm'
import {
    AnyMySqlColumn,
    boolean,
    index,
    int,
    mysqlTable,
    text,
    timestamp,
    unique,
    varchar,
} from 'drizzle-orm/mysql-core'

export const news = mysqlTable('news', {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    contents: text('contents').notNull(),
    authorId: int('author_id')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').onUpdateNow(),
    deletedAt: timestamp('deleted_at'),
})

export const newsRelations = relations(news, ({ one, many }) => ({
    author: one(users, {
        fields: [news.authorId],
        references: [users.id],
    }),
    comments: many(newsComments),
}))

export const newsComments = mysqlTable(
    'news_comments',
    {
        id: int('id').autoincrement().primaryKey(),
        newsId: int('news_id')
            .notNull()
            .references(() => news.id),
        parentId: int('parent_id').references((): AnyMySqlColumn => newsComments.id),
        authorId: int('author_id')
            .notNull()
            .references(() => users.id),
        depth: int('depth').notNull().default(0),
        indexInNews: int('index_in_news').notNull(),
        contents: text('contents').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').onUpdateNow(),
        deletedAt: timestamp('deleted_at'),
        hardDeleted: boolean('hard_deleted').notNull().default(false),
    },
    table => ({
        newsIdIndex: index('news_id_index').on(table.newsId),
        parentIdIndex: index('parent_id_index').on(table.parentId),
    }),
)

export const newsCommentsRelations = relations(newsComments, ({ one }) => ({
    news: one(news, {
        fields: [newsComments.newsId],
        references: [news.id],
    }),
    author: one(users, {
        fields: [newsComments.authorId],
        references: [users.id],
    }),
    parent: one(newsComments, {
        fields: [newsComments.parentId],
        references: [newsComments.id],
    }),
}))

export const users = mysqlTable('users', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    avatar: varchar('avatar', { length: 255 }).notNull(),
    displayId: varchar('display_id', { length: 60 }).notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
    oauthAccounts: many(oauthAccounts),
    news: many(news),
    comments: many(newsComments),
    roles: many(roles),
}))

export const roles = mysqlTable(
    'roles',
    {
        id: int('id').autoincrement().primaryKey(),
        name: varchar('name', { length: 20, enum: ['admin', 'reporter'] }).notNull(),
        userId: int('user_id').references(() => users.id),
    },
    table => ({
        userIdIndex: index('user_id_index').on(table.userId),
        userIdNameUnique: unique('user_id_name_unique').on(table.userId, table.name),
    }),
)

export type Role = (typeof roles.$inferSelect)['name']

export const rolesRelations = relations(roles, ({ one }) => ({
    user: one(users, {
        fields: [roles.userId],
        references: [users.id],
    }),
}))

export const oauthAccounts = mysqlTable('oauth_accounts', {
    id: int('id').autoincrement().primaryKey(),
    userId: int('user_id')
        .notNull()
        .references(() => users.id),
    provider: varchar('provider', { length: 20, enum: ['github'] }).notNull(),
    providerAccountId: text('provider_account_id').notNull(),
})

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
    user: one(users, {
        fields: [oauthAccounts.userId],
        references: [users.id],
    }),
}))
