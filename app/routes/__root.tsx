import type { LoaderFunction, MetaFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import type { ColorScheme} from "@mantine/core";
import { ColorSchemeProvider, createEmotionCache, MantineProvider } from "@mantine/core";
import { useState } from "react";
import { getThemeSession } from "../cookies/theme.cookie";
import { Notifications } from "@mantine/notifications";
import ErrorPage from "~/components/ErrorPage";

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
        <Outlet />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(
    request.headers.get("Cookie")
  );
  const theme = themeSession.get("theme") || 'light'

  return json({ theme });
}

export function CatchBoundary() {
  let caught = useCatch();
  let message = caught?.statusText;
  if (typeof caught?.data === "string") {
    message = caught?.data;
  }
  const { theme } = useLoaderData<{ theme: ColorScheme }>()

  const [colorScheme, setColorScheme] = useState<ColorScheme>(theme);
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <Notifications />
        <ErrorPage code={caught?.status} title={message} subtitle="" showGoToHome />
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
