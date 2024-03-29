import { Flex, Stack, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import type { LoaderFunction} from "@remix-run/node";
import { json} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet, useCatch } from "@remix-run/react";
import type { User } from "~/@types/User";
import ErrorPage from "~/components/ErrorPage";
import Shell from "~/components/Shell";
import { commitAuthSession, getAuthSession } from "~/cookies/auth.cookie";
import getApi from "~/utils/getApi";
import withAuth from "~/utils/withAuth";

export const loader: LoaderFunction = async ({ request }) => {
  const api = await getApi()
  let user: User = await withAuth()

  const authSession = await getAuthSession(
    request.headers.get("Cookie")
  );

  if(!user) {
    if(!authSession?.data?.user?.token) return redirect('/login')
    
    const response = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${authSession?.data?.user?.token}`
      }
    })

    user = response.data
  }
  
  authSession.set('user', { token: authSession.data.user.token, ...user })

  const headers = new Headers()
  headers.append('Set-Cookie', await commitAuthSession(authSession))

  delete user?.token

  if(user?.firstLogin) return redirect('/first-login')

  return json({ user }, { headers })
}

export default function Dashboard() {
  const colorScheme = useMantineColorScheme()
  const theme = useMantineTheme()

  const dark = colorScheme.colorScheme === 'dark'

  return (
    <Flex direction={{ base: 'column', md: 'row' }} pt={{ base: '60px', md: 0 }} pl={{ base: 0, md: '300px' }}>
      <Shell />
      <Stack
        py={16}
        bg={dark ? theme.colors.dark[8] : theme.colors.gray[0]}
        w="100%"
        sx={{ minHeight: '100vh'}}
      >
        <Outlet />
      </Stack>
    </Flex>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  const colorScheme = useMantineColorScheme()
  const theme = useMantineTheme()

  const dark = colorScheme.colorScheme === 'dark'

  return (
    <Flex direction={{ base: 'column', md: 'row' }} pt={{ base: '60px', md: 0 }} pl={{ base: 0, md: '300px' }}>
      <Shell />
      <Stack
        py={16}
        bg={dark ? theme.colors.dark[8] : theme.colors.gray[0]}
        w="100%"
        sx={{ minHeight: '100vh'}}
      >
        <ErrorPage code={caught.status} />
      </Stack>
    </Flex>
  )
}
