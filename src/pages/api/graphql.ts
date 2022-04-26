import cors from 'cors'
import type { NextApiHandler } from 'next'
import connect from 'next-connect'
import apolloSeverReady from '../../libs/apolloSeverReady'

export const config = {
    api: {
        bodyParser: false,
    },
}

let handler: NextApiHandler

export default connect()
    .use(cors({ origin: process.env.NODE_ENV === 'development' }))
    .use((async (req, res) => {
        if (handler) {
            return handler(req, res)
        }
        const apollo = await apolloSeverReady
        return (handler ??= apollo.createHandler({ path: '/api/graphql' }))(req, res)
    }) as NextApiHandler)
