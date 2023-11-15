import { NextResponse } from "next/server";

export function middleware(request: Request) {
    // store current request url in a custom header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}
