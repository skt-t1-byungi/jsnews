import { ApolloServer } from 'apollo-server-micro'
import cors from 'cors'
import type { NextApiHandler } from 'next'
import connect from 'next-connect'
import { readFileSync } from 'node:fs'
import { mergeResolvers } from '@graphql-tools/merge'

export const config = {
    api: {
        bodyParser: false,
    },
}

let handler: NextApiHandler

let starting: Promise<void> | null = (async () => {
    const apollo = new ApolloServer({
        typeDefs: readFileSync(new URL('../../schema.gql', import.meta.url), 'utf-8'),
        resolvers: await loadAllResolvers(),
    })
    await apollo.start()
    handler = apollo.createHandler({ path: '/api/graphql' })
    // @ts-ignore
    starting = null
})()

export default connect()
    .use(cors({ origin: process.env.NODE_ENV === 'development' }))
    .use((async (req, res) => {
        if (starting) await starting
        return handler(req, res)
    }) as NextApiHandler)

async function loadAllResolvers() {
    // @ts-ignore
    const r = require.context('../../resolvers', false, /\.ts$/)
    return mergeResolvers((await Promise.all(r.keys().map((f: string) => r(f)))).map((m: any) => m.default))
}
