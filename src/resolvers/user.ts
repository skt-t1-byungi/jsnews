import defineResolver from '../libs/defineResolver'

export default defineResolver({
    Query: {
        user: () => ({
            id: '1',
            name: 'John Doe',
        }),
    },
    User: {
        id: parent => parent.id,
        name: parent => parent.name.toUpperCase(),
    },
})
