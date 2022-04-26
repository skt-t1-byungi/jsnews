import { ApolloServer } from 'apollo-server-micro'
import { readFileSync } from 'node:fs'
import { mergeResolvers } from '@graphql-tools/merge'

export default (async () => {
    const apollo = new ApolloServer({
        typeDefs: readFileSync(new URL('../../schema.gql', import.meta.url), 'utf-8'),
        resolvers: await loadAllResolvers(),
    })
    await apollo.start()
    return apollo
})()

async function loadAllResolvers() {
    // @ts-ignore
    const r = require.context('../../resolvers', false, /\.ts$/)
    return mergeResolvers((await Promise.all(r.keys().map((f: string) => r(f)))).map((m: any) => m.default))
}
