import type { LoaderFunction, MetaFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { ColorScheme} from "@mantine/core";
import { ColorSchemeProvider, createEmotionCache, MantineProvider } from "@mantine/core";
import { StylesPlaceholder } from "@mantine/remix";
import { useState } from "react";
import { getThemeSession } from "./cookies/theme.cookie";
import { getAuthSession } from "./cookies/auth.cookie";
import { Notifications } from "@mantine/notifications";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

createEmotionCache({ key: "mantine" });

export default function App() {
  const { theme } = useLoaderData<{ theme: ColorScheme }>()


  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <html lang="en">
          <head>
            <StylesPlaceholder />
            <Meta />
            <Links />
          </head>
          <body>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(
    request.headers.get("Cookie")
  );
  const theme = themeSession.get("theme") || 'light'

  const authSession = await getAuthSession(
    request.headers.get("Cookie")
  );

  const user = authSession.get("user") || null
  delete user?.token

  return json({ theme, user });
}