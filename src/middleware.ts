import { NextRequest, NextResponse } from "next/server";
import { withMiddlewareAuthRequired, getSession } from "@auth0/nextjs-auth0/edge";

export default withMiddlewareAuthRequired(async (req: NextRequest) => {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  return res;
});


export const config = {
  matcher: ["/bookmark"], 
};

