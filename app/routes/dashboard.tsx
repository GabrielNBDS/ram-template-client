import { Flex, Stack, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import type { LoaderFunction} from "@remix-run/node";
import { json} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Shell from "~/components/Shell";
import { commitAuthSession, getAuthSession } from "~/cookies/auth.cookie";
import getApi from "~/utils/api";
import withAuth from "~/utils/withAuth";

export const loader: LoaderFunction = async ({ request }) => {
  const api = await getApi()
  let user = await withAuth(request)

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

  return json({}, { headers })
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