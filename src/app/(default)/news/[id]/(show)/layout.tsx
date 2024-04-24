export default function Layout({ comments, children }: { comments: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div>
            <div>{children}</div>
            <div>{comments}</div>
        </div>
    )
}
