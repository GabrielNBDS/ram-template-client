import { createCookieSessionStorage } from "@remix-run/node";

const {
  getSession: getAuthSession,
  commitSession: commitAuthSession,
  destroySession: destroyAuthSession
} = createCookieSessionStorage({
    cookie: {
      name: "user",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 2147483647
    },
  });

export { getAuthSession, commitAuthSession, destroyAuthSession };