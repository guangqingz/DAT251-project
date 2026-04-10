import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const path = request.nextUrl.pathname;

    if (path.startsWith("/login")) {
        return NextResponse.next();
    }
    // Protect dashboard
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
}

