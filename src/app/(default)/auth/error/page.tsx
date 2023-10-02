export default function Page({ searchParams }: { searchParams: { error?: string } }) {
    return (
        <div>
            <h2>Auth Error</h2>
            <p>{searchParams.error}</p>
        </div>
    )
}
