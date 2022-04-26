module.exports = {
    schema: './src/schema.gql',
    generates: {
        './src/__generated__/resolver-types.ts': {
            config: { useIndexSignature: true },
            plugins: ['typescript', 'typescript-resolvers'],
        },
    },
}
