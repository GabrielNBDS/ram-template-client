import { Avatar, Box, Card, Container, Group, ScrollArea, Table, Text } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { Paginated } from "~/@types/Paginated";
import type { User } from "~/@types/User";
import RoleBadge from "~/components/RoleBadge";
import getApi from "~/utils/api";

export const loader: LoaderFunction = async ({ request }) => {
  const api = await getApi(request)

  try {
    const response = await api.get('/users')
    
    return json(response.data)
  } catch (error) {
    throw new Response("Forbidden", { status: 403 })
  }

}

export default function Users() {
  const users = useLoaderData<Paginated<User>>()

  const navigate = useNavigate()

  const rows = users.data.map((user) => (
    <Box onClick={() => navigate(`/dashboard/users/${user.id}`)} component="tr" sx={{ cursor: 'pointer' }} key={user.name}>
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
    </Container>
  )
}