import { Button, Card, Container, Flex, Group, Stack, Text } from "@mantine/core";
import type { ActionFunction} from "@remix-run/node";
import { redirect} from "@remix-run/node";
import { unstable_createMemoryUploadHandler} from "@remix-run/node";
import { unstable_parseMultipartFormData} from "@remix-run/node";
import { json} from "@remix-run/node";
import { Form, Outlet, useActionData } from "@remix-run/react";
import { FiLogOut } from "react-icons/fi";
import type { AdonisError, AdonisErrorItems } from "~/@types/AdonisError";
import FormErrorsList from "~/components/formErrorsList";
import ChangeEmailDialog from "~/components/me/ChangeEmailDialog";
import ChangeNameDialog from "~/components/me/ChangeNameDialog";
import ChangePasswordDialog from "~/components/me/ChangePasswordDialog";
import EditAvatar from "~/components/me/EditAvatar";
import ToggleThemeButton from "~/components/me/ToggleThemeButton";
import { destroyAuthSession, getAuthSession } from "~/cookies/auth.cookie";
import { commitThemeSession, getThemeSession } from "~/cookies/theme.cookie";
import getApi from "~/utils/api";
import getAuthToken from "~/utils/getAuthToken";
import useUser from "~/utils/hooks/useUser";
import updateUser from "~/utils/updateUser";

export const action: ActionFunction = async ({ request }) => {
  const api = await getApi(request)
  const uploadHandler = unstable_createMemoryUploadHandler({ maxPartSize: 1024 * 1024 * 50});
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const form = formData.get('action')

  const avatar = formData.get('avatar') as File
  if(avatar) {
    const body = new FormData()
    body.append('avatar', avatar)
    const token = await getAuthToken(request)
    const response = await fetch(
      `${process.env.API_URL}/me/change-avatar`, 
      { 
        method: 'PATCH', 
        body: body, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const data = await response.json()

    if(response.status !== 200) {
      return json(data)
    }

    
    const headers = await updateUser(request, data)
    
    return json({ success: true, key: 'change-avatar' }, { headers });
  }

  switch (form) {
    case 'change-name':
      try {
        const name = formData.get('name')
        
        const response = await api.patch('/me/change-name', { name })
        
        const headers = await updateUser(request, response.data)
        return json({ success: true, key: 'change-name' }, { headers });
      } catch (error) {
        return json({ errors: (error as AdonisError).response.data.errors })
      }

    case 'change-password':
      try {
        const password = formData.get('password')
        const newPassword = formData.get('newPassword')

        await api.patch('/me/change-password', { password, newPassword })
      
        return json({ success: true, key: 'change-password' });
      } catch (error) {
        return json({ errors: (error as AdonisError).response.data.errors })
      }

    case 'change-email':
      try {
        const email = formData.get('email')

        await api.patch('/me/change-email', { email })
      
        return json({ success: true, key: 'change-email' });
      } catch (error) {
        return json({ errors: (error as AdonisError).response.data.errors })
      }

      case 'remove-avatar':
        try {
          const response = await api.delete('/me/remove-avatar')
          
          const headers = await updateUser(request, response.data)
          return json({ success: true, key: 'remove-avatar' }, { headers });
        } catch (error) {
          return json({ errors: (error as AdonisError).response.data.errors })
        }
      
      case 'toggle-theme':
        const themeSession = await getThemeSession(
          request.headers.get("Cookie")
        );
      
        const theme = themeSession.get("theme") || 'light'
      
        themeSession.set("theme", theme === 'light' ? 'dark' : 'light');
      
        return json(null, {
          headers: {
            "Set-Cookie": await commitThemeSession(themeSession),
          },
        });

      case 'logout':
        await api.delete('/me/logout')
        const authSession = await getAuthSession(
          request.headers.get("Cookie")
        );
        return redirect('/login', {
          headers: {
            "Set-Cookie": await destroyAuthSession(authSession),
          },
        });
  }

  return { data: true }
}

export default function Me() {
  const { name, email } = useUser()
  const actionData = useActionData() as { errors?: AdonisErrorItems[] }

  return (
    <Container size="xs" w="100%">
      <Card shadow="sm">
        <Stack>
          <Flex w="100%" justify="space-between">
            <Group>
              <EditAvatar />

              <Stack spacing={2}>
                <Text size="xl" weight={500}>
                  {name}
                  <ChangeNameDialog />
                </Text>

                <Text color="dimmed">
                  {email}
                  <ChangeEmailDialog />
                </Text>
              </Stack>
            </Group>

            <ToggleThemeButton />
          </Flex>

          <Outlet />

          <FormErrorsList errors={actionData?.errors} /> 

          <Flex w="100%" gap={8}>
            <ChangePasswordDialog />

            <Form style={{ width: '100%' }} encType="multipart/form-data" method="post" action="/dashboard/me">
              <Button 
                type="submit"
                name="action"
                value="logout" 
                variant="outline" 
                w="100%"
                color="red" 
                rightIcon={<FiLogOut />}
              >
                Sair
              </Button>
            </Form>
          </Flex>
        </Stack>
      </Card>
    </Container>
  )
}
