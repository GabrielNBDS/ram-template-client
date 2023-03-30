import { Chip, Group, LoadingOverlay } from "@mantine/core"
import { notifications } from "@mantine/notifications";
import { roles } from "~/components/RoleBadge";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";

interface ChangeUserRoleProps {
  defaultRole: string
}

export default function ChangeUserRole({ defaultRole }: ChangeUserRoleProps) {
  const { fetcher, loading } = useRemixSubmit({
    queryKey: 'change-role',
    onSuccess: () => {
      notifications.show({
        message: 'Usuário atualizado',
      })
    },
  });

  return (
    <Chip.Group defaultValue={defaultRole} onChange={(value) => {
      const formData = new FormData()
      formData.set('role', value as string);
      formData.set('action', 'change-role');
      fetcher.submit(formData, { method: 'patch' })
    }}>
      <Group position="center">
        <LoadingOverlay visible={loading} overlayBlur={1} />
        {roles.map(({ color, label, value}) => (
          <Chip
            key={value}
            value={value}
            color={color}
            variant="outline"
          >
            {label}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  )
}