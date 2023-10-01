import db, { q, oauthAccounts, users } from '@/db'
import slugify from '@sindresorhus/slugify'
import { AuthOptions, getServerSession } from 'next-auth'
import GithubProvider, { GithubProfile } from 'next-auth/providers/github'
import { cache } from 'react'
import { pick } from 'remeda'
import { uid } from 'uid/secure'

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
                    account: pick(account, ['provider', 'providerAccountId']),
                },
            )
        },
        async session({ session, token }) {
            return Object.assign(session, {
                account: token.account as {
                    provider: 'github'
                    providerAccountId: string
                },
            })
        },
        async signIn({ account, profile }) {
            if (!account || !isProfile(profile, 'github')) {
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
                        displayId: slugify(profile.login),
                        name: profile.name!,
                        email: profile.email!,
                        avatar: profile.avatar_url,
                    })
                    .onDuplicateKeyUpdate({
                        set: {
                            displayId: slugify(`${profile.login}-${uid()}`),
                        },
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
    },
} satisfies AuthOptions

export const getSession = cache(() => getServerSession(authOptions))

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

// for type guard of profile
function isProfile<T extends string>(
    profile: any,
    name: T,
): profile is 'github' extends T ? GithubProfile : never {
    return profile?.provider === name
}
