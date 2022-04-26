import { ApolloServer } from 'apollo-server-micro'
import type { NextApiHandler } from 'next'
import connect from 'next-connect'
import cors from 'cors'
import { readFileSync } from 'node:fs'

export const config = {
    api: {
        bodyParser: false,
    },
}

const app = new ApolloServer({
    typeDefs: readFileSync(new URL('../../schema.gql', import.meta.url), 'utf-8'),
    resolvers: {
        Query: {
            user: () => ({ name: 'hello', id: 'test' }),
        },
    },
})

let handler: NextApiHandler

export default connect()
    .use(cors({ origin: process.env.NODE_ENV === 'development' }))
    .use((async (req, res) => {
        if (!handler) {
            await app.start()
        }
        return (handler ??= app.createHandler({ path: '/api/graphql' }))(req, res)
    }) as NextApiHandler)
