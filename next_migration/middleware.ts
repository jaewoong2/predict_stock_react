import { NextRequest, NextResponse } from "next/server";

const JWT_TOKEN_KEY = process.env.NEXT_PUBLIC_JWT_TOKEN_KEY ?? "access_token";

export function middleware(req: NextRequest, res: NextResponse) {
  const url = req.nextUrl.clone();
  const response = NextResponse.next();
  const code = url.searchParams.get("code");

  if (req.nextUrl.pathname === "/logout") {
    response.cookies.delete(JWT_TOKEN_KEY);
    return response;
  }

  if (code) {
    response.cookies.set(JWT_TOKEN_KEY, code);
  }

  return response;
}
