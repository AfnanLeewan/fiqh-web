import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if admin session cookie exists
    const sessionCookie = request.cookies.get("admin-session");

    if (sessionCookie?.value === "authenticated") {
      return NextResponse.json({
        authenticated: true,
      });
    } else {
      return NextResponse.json({
        authenticated: false,
      });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        authenticated: false,
      },
      { status: 500 },
    );
  }
}
