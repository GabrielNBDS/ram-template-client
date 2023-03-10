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
    },
  });

export { getAuthSession, commitAuthSession, destroyAuthSession };