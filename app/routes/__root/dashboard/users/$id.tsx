import { Avatar, Card, Container, Flex, Group, Stack, Text, UnstyledButton } from "@mantine/core"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { FiArrowLeft } from "react-icons/fi"
import type { User } from "~/@types/User"
import getApi from "~/utils/api"

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params
  const api = await getApi(request)

  try {
    const response = await api.get(`/users/${id}`)
    return json(response.data)
  } catch (error: any) {
    throw new Response("Not Found", { status: error.response.status })
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
              </Stack>
            </Group>
          </Flex>
        </Stack>
      </Card>
    </Container>
  )
}