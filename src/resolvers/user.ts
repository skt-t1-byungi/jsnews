import defineResolver from '../utils/defineResolver'

export default defineResolver({
    Query: {
        user: () => ({
            id: '1',
            name: 'Doe',
        }),
    },
    User: {
        id: parent => parent.id,
        name: parent => `${parent.name} John Doe`,
    },
})
