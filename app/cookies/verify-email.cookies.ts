import { createCookieSessionStorage } from "@remix-run/node";

const { 
  getSession: getVerifyEmailSession, 
  commitSession: commitVerifyEmailSession, 
  destroySession: destroyVerifyEmailSession
} = createCookieSessionStorage({
    cookie: {
      name: "verify-url",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
    },
  });

export { 
  getVerifyEmailSession, 
  commitVerifyEmailSession, 
  destroyVerifyEmailSession 
};