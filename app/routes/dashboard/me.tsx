import { Avatar, Button, Card, Container, Flex, Group, Stack, Text } from "@mantine/core";
import type { ActionFunction} from "@remix-run/node";
import { json} from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { FiLogOut } from "react-icons/fi";
import type { AdonisError } from "~/@types/AdonisError";
import ChangeEmailDialog from "~/components/ChangeEmailDialog";
import ChangeNameDialog from "~/components/ChangeNameDialog";
import ChangePasswordDialog from "~/components/ChangePasswordDialog";
import ToggleThemeButton from "~/components/toggleThemeButton";
import getApi from "~/utils/api";
import updateUser from "~/utils/updateUser";

export const action: ActionFunction = async ({ request }) => {
  const api = await getApi(request)
  const formData = await request.formData()

  const form = formData.get('action')
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
  }

  return { data: true }
}

export default function Me() {
  return (
    <Container size="xs" w="100%">
      <Card shadow="sm">
        <Stack>
          <Flex w="100%" justify="space-between">
            <Group>
              <Avatar
                w="128px"
                h="128px"
                sx={{ borderRadius: '50%' }}
                src="https://avatars.githubusercontent.com/u/48018647?v=4"
              />

              <Stack spacing={2}>
                <Text size="xl" weight={500}>
                  Gabriel de Souza
                  <ChangeNameDialog />
                </Text>

                <Text color="dimmed">
                  gabriel.nbds@gmail.com
                  <ChangeEmailDialog />
                </Text>
              </Stack>
            </Group>

            <ToggleThemeButton />
          </Flex>

          <Outlet />

          <Flex w="100%" gap={8}>
            <ChangePasswordDialog />

            <Button variant="outline" w="100%" color="red" rightIcon={<FiLogOut />}>Sair</Button>
          </Flex>
        </Stack>
      </Card>
    </Container>
  )
}
