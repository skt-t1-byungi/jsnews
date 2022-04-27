import { ApolloServer } from 'apollo-server-micro'
import { mergeResolvers } from '@graphql-tools/merge'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export default (async () => {
    const apollo = new ApolloServer({
        typeDefs: readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../schema.gql'), 'utf-8'),
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
