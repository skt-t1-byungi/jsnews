import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { AppProps } from 'next/app'
import { PropsWithChildren, useMemo } from 'react'
import { GraphQLTaggedNode, useLazyLoadQuery, RelayEnvironmentProvider, fetchQuery } from 'react-relay'
import { OperationType } from 'relay-runtime'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

const env = new Environment({
    network: Network.create(
        typeof window === 'undefined'
            ? async (request, variables) => {
                  const apollo = await import('./apolloSeverReady').then(m => m.default)
                  return apollo.executeOperation({ query: request.text ?? undefined, variables })
              }
            : async (request, variables) => {
                  const resp = await fetch('/api/graphql', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ query: request, variables }),
                  })
                  return resp.json()
              }
    ),
    store: new Store(new RecordSource()),
})

function preload<T extends OperationType>(query: GraphQLTaggedNode, variables: T['variables'] = {}) {
    return fetchQuery(env, query, variables).toPromise()
}

const PAGE_STATE_KEY = '__RELAY-PAGE-STATE__'
type Preloader = typeof preload

export function withRelayPage(
    getProps: (preload: Preloader, ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<any> | void>
): GetServerSideProps {
    return async ctx => {
        const result: any = await getProps(preload, ctx)
        if (!result) {
            return {
                props: {
                    [PAGE_STATE_KEY]: env.getStore().getSource().toJSON(),
                },
            }
        }
        if (!result.props) {
            return result
        }
        return {
            ...result,
            props: {
                ...result.props,
                [PAGE_STATE_KEY]: env.getStore().getSource().toJSON(),
            },
        }
    }
}

export function RelayPageProvider({ pageProps, children }: PropsWithChildren<{ pageProps: AppProps }>) {
    const state = (pageProps as any)[PAGE_STATE_KEY]
    useMemo(() => {
        if (state) {
            env.getStore().publish(new RecordSource(state))
        }
    }, [state])
    return <RelayEnvironmentProvider environment={env}>{children}</RelayEnvironmentProvider>
}

export function usePageQuery<T extends OperationType>(query: GraphQLTaggedNode, variables: T['variables'] = {}) {
    return useLazyLoadQuery<T>(query, variables, { fetchPolicy: 'store-only' })
}
