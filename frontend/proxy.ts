import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {jwtDecode} from 'jwt-decode'

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const path = request.nextUrl.pathname;

    if (path.startsWith("/login")) {
        return NextResponse.next();
    }
    // redirect to login page if user tries to access staff/admin protected site without being logged inn
    if (token == null) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    // get the jwt decoded
    const jwtDecoded: any = jwtDecode(token);
    // Protect dashboard
    if (path.startsWith("/dashboard") && (jwtDecoded.role !== "ADMIN" || jwtDecoded.role !== "STAFF")) {
        // For now, return to main page
        return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
}

