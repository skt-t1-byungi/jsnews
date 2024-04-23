import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next()
    }

    // for dev preview
    const credential = btoa(`${process.env.DEV_AUTH_ID}:${process.env.DEV_AUTH_PW}`)
    if (req.headers.get('Authorization') === `Basic ${credential}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            {
                status: 401,
                headers: {
                    'WWW-Authenticate': 'Basic realm="preview"',
                },
            },
        )
    }

    return NextResponse.next()
}
