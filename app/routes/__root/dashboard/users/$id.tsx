import {
  Avatar,
  Card,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  UnstyledButton
} from "@mantine/core"
import type { ActionFunction, LoaderFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { FiArrowLeft } from "react-icons/fi"
import type { AdonisError } from "~/@types/AdonisError"
import type { User } from "~/@types/User"
import ChangeUserRole from "~/components/users/ChangeUserRole";
import DeleteUserDialog from "~/components/users/DeleteUserDialog";
import getApi from "~/utils/getApi"
import getUser from "~/utils/getUser"

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params
  const user = await getUser(request)
  const api = await getApi(request)
    
  if(user.id == id) {
    return redirect('/dashboard/me')
  }

  try {
    const response = await api.get(`/users/${id}`)
    return json(response.data)
  } catch (error: any) {
    throw new Response("Not Found", { status: error.response.status })
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params
  const api = await getApi(request)
  const formData = await request.formData()
  
  const form = formData.get('action')
  console.log(1)
  const key = form
  switch (form) {
    case 'delete-user':
      try {
        await api.delete(`/users/${id}`)
    
        return redirect('/dashboard/users',
        {
          headers: {
            "Set-Cookie": 'deletedUser=1',
          },
        })
      } catch (error) {
        return json({ errors: (error as AdonisError).response.data.errors, key })
      }
    case 'change-role':
      try {
        const role = formData.get('role')
        
        await api.patch(`/users/${id}/change-role`, { role })
        
        return json({ success: true, key });
      } catch (error) {
        return json({ errors: (error as AdonisError).response.data.errors, key })
      }
  }
}

export default function UserPage() {
  const user = useLoaderData<User>()

  const navigate = useNavigate()

  return (
    <Container size="lg" w="100%">
      <UnstyledButton
        display="flex"
        sx={{
          alignItems: 'center',
          gap: 4,
        }}
        maw="max-content"
        onClick={() => navigate(-1)}
        mb={16}
      >
        <FiArrowLeft /> Voltar
      </UnstyledButton>

      <Card shadow="sm">
        <Stack>
          <Flex w="100%" justify="space-between">
            <Group>
              <Avatar
                w="128px"
                h="128px"
                sx={{ borderRadius: '50%' }}
                src={user.avatar?.url}
              />

              <Stack spacing={2}>
                <Text size="xl" weight={500}>
                  {user.name}
                </Text>

                <Text color="dimmed">
                  {user.email}
                </Text>

                <ChangeUserRole defaultRole={user.role} />
              </Stack>
            </Group>

            <DeleteUserDialog />
          </Flex>
        </Stack>
      </Card>
    </Container>
  )
}