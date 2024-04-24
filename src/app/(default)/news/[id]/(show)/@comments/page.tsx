import { getUser, hasRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Comment, WriteForm } from './components'
import { getCommentsQuery, deleteCommentQuery, editCommentQuery, writeCommentQuery } from '@/queries/comments'

export default async function Page({ params }: { params: { id: string } }) {
    const newsId = Number(params.id)
    const [data, user] = await Promise.all([getCommentsQuery(newsId), getUser()])
    return (
        <>
            <ul>
                {data.map(comment => (
                    <Comment
                        key={comment.id}
                        data={comment}
                        replyAction={
                            user
                                ? async form => {
                                      'use server'
                                      await writeCommentQuery({
                                          newsId,
                                          contents: form.get('contents') as string,
                                          authorId: user.id,
                                          parentId: comment.id,
                                          depth: comment.depth + 1,
                                      })
                                      revalidatePath(`/news/${newsId}`)
                                  }
                                : undefined
                        }
                        editAction={
                            comment.author.id === user?.id || hasRole(user, 'admin')
                                ? async form => {
                                      'use server'
                                      await editCommentQuery({
                                          id: comment.id,
                                          contents: form.get('contents') as string,
                                      })
                                      revalidatePath(`/news/${newsId}`)
                                  }
                                : undefined
                        }
                        deleteAction={
                            comment.author.id === user?.id || hasRole(user, 'admin')
                                ? async () => {
                                      'use server'
                                      await deleteCommentQuery({ id: comment.id, newsId })
                                      revalidatePath(`/news/${newsId}`)
                                  }
                                : undefined
                        }
                    />
                ))}
            </ul>
            {user && (
                <WriteForm
                    action={async form => {
                        'use server'
                        await writeCommentQuery({
                            newsId,
                            contents: form.get('contents') as string,
                            authorId: user.id,
                        })
                        revalidatePath(`/news/${newsId}`)
                    }}
                />
            )}
        </>
    )
}
