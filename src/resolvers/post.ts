import defineResolver from '../utils/defineResolver'

export default defineResolver({
    Query: {
        posts: () => [
            { id: '1', title: 'Post 1', content: 'Content 1' },
            { id: '2', title: 'Post 2', content: 'Content 2' },
            { id: '3', title: 'Post 3', content: 'Content 3' },
        ],
    },
    Post: {
        id: parent => parent.id,
        content: parent => parent.content,
        title: parent => `parent.title ${parent.title}`,
    },
})
