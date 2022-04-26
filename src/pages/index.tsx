import { graphql } from 'react-relay'

const query = graphql`
    query pagesQuery {
        user {
            id
            name
        }
    }
`

export default function Index() {
    return <div className="bg-slate-300 text-4xl">hello world</div>
}
