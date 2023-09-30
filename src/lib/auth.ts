import db, { q } from '@/db'
import { oauthAccounts, users } from '@/db/schema'
import { AuthOptions, CallbacksOptions, Session, getServerSession } from 'next-auth'
import GithubProvider, { GithubProfile } from 'next-auth/providers/github'
import { cache } from 'react'

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, account }) {
            return Object.assign(
                token,
                account && {
                    account: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    },
                },
            )
        },
        async session({ session, token }) {
            return Object.assign(session, { account: token.account })
        },
        async signIn({ account, profile }) {
            if (!account || !profile) {
                return false
            }
            await db.transaction(async tx => {
                const isSaved = await tx.query.oauthAccounts
                    .findFirst({
                        where: q.and(
                            q.eq(oauthAccounts.provider, account.provider as any),
                            q.eq(oauthAccounts.providerAccountId, account.providerAccountId),
                        ),
                    })
                    .then(Boolean)
                if (isSaved) {
                    return
                }
                const userId = await tx
                    .insert(users)
                    .values({
                        name: profile.name!,
                        email: profile.email!,
                        avatar: profile.avatar_url,
                    })
                    .then(([h]) => h.insertId)
                await tx.insert(oauthAccounts).values({
                    userId,
                    provider: account.provider as any,
                    providerAccountId: account.providerAccountId,
                })
            })
            return true
        },
    } as Partial<CallbacksOptions<GithubProfile>>,
} as AuthOptions

export const getSession = cache(
    () =>
        getServerSession(authOptions) as Promise<
            | (Session & {
                  account: {
                      provider: 'github'
                      providerAccountId: string
                  }
              })
            | null
        >,
)

export const getUser = cache(async () => {
    const session = await getSession()
    if (!session) {
        return null
    }
    return await db.query.oauthAccounts
        .findFirst({
            where: q.and(
                q.eq(oauthAccounts.provider, session.account.provider),
                q.eq(oauthAccounts.providerAccountId, session.account.providerAccountId),
            ),
            with: {
                user: true,
            },
        })
        .then(v => v?.user)
})
