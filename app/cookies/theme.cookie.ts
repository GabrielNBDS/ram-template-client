import { createCookieSessionStorage } from "@remix-run/node";

const { getSession: getThemeSession, commitSession: commitThemeSession } =
  createCookieSessionStorage({
    cookie: {
      name: "theme",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: 2147483647
    },
  });

export { getThemeSession, commitThemeSession };