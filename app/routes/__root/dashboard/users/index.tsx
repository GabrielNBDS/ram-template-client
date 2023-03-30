import { Avatar, Box, Card, Container, Flex, Group, Pagination, ScrollArea, Table, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { AdonisError } from "~/@types/AdonisError";
import type { Paginated } from "~/@types/Paginated";
import type { User } from "~/@types/User";
import NewUserDialog from "~/components/NewUserDialog";
import RoleBadge from "~/components/RoleBadge";
import getApi from "~/utils/getApi";
import useMount from "~/utils/hooks/useMount";
import Cookies from 'js-cookie'


export const loader: LoaderFunction = async ({ request }) => {
  const api = await getApi(request)

  const url = new URL(request.url)
  const page = url.searchParams.get('page')

  try {
    const response = await api.get(`/users?page=${page || 1}`)

    return json(response.data)
  } catch (error) {
    throw new Response("Forbidden", { status: 403 })
  }
}

export const action: ActionFunction = async ({ request }) => {
  const key = 'create-user'
  const api = await getApi(request)
  const formData = await request.formData()
  
  const name = formData.get('name')
  const email = formData.get('email')
  
  try {
    await api.post('/users/create', { name, email })

    return json({ success: true, key });
  } catch (error) {
    return json({ errors: (error as AdonisError).response.data.errors, key })
  }
}

export default function Users() {
  useMount(() => {
    if(Cookies.get('deletedUser')) {
      notifications.show({
        message: 'Usuário removido',
      })

      Cookies.remove('deletedUser', { path: '/dashboard/users' })
    }
  })

  const users = useLoaderData<Paginated<User>>()

  const navigate = useNavigate()

  const rows = users.data.map((user) => (
    <Box onClick={() => navigate(`/dashboard/users/${user.id}`)} component="tr" sx={{ cursor: 'pointer' }} key={user.id}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={user.avatar?.url} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {user.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <RoleBadge role={user.role} />
      </td>
    </Box>
  ));

  return (
    <Container size="lg" w="100%">
      <Card shadow="sm" p="0">
        <ScrollArea>
          <Table miw={800} verticalSpacing="sm" highlightOnHover>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
      </Card>

      <Flex mt={16} sx={{ alignItems: 'center', justifyContent: 'space-between'}}>
        {users.meta.lastPage > 1 && 
          <Pagination
            total={users.meta.lastPage}
            defaultValue={users.meta.currentPage}
            getItemProps={(page) => ({
              component: Link,
              to: `/dashboard/users?page=${page}`,
            })}
          />
        }

        <NewUserDialog />
      </Flex>
    </Container>
  )
}