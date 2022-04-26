import { ApolloServer } from 'apollo-server-micro'
import raw from 'raw.macro'
import { mergeResolvers } from '@graphql-tools/merge'

export default (async () => {
    const apollo = new ApolloServer({
        typeDefs: raw('../schema.gql'),
        resolvers: await loadAllResolvers(),
    })
    await apollo.start()
    return apollo
})()

async function loadAllResolvers() {
    // @ts-ignore
    const r = require.context('../resolvers', false, /\.ts$/)
    return mergeResolvers((await Promise.all(r.keys().map((f: string) => r(f)))).map((m: any) => m.default))
}
