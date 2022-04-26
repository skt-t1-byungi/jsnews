import { graphql } from 'react-relay'
import { usePageQuery, withRelayPage } from '../libs/next-relay-tools'
import { pagesQuery } from './__generated__/pagesQuery.graphql'

const query = graphql`
    query pagesQuery {
        user {
            id
            name
        }
    }
`

export default function Index() {
    const data = usePageQuery<pagesQuery>(query)
    return <div className="bg-slate-300 text-4xl">{data.user?.name}, hello world</div>
}

export const getServerSideProps = withRelayPage(async preload => {
    await preload(query)
})
