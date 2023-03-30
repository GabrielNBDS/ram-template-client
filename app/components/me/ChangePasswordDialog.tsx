import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { FiKey } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';

export default function ChangePasswordDialog() {
  const [opened, { open, close }] = useDisclosure(false);
  
  const { fetcher, loading } = useRemixSubmit({
    queryKey: "change-password",
    onSuccess: () => {
      close()
      notifications.show({
        message: 'Senha atualizada',
      })
    },
  });

  const formErrors = useGetFormErrors<'password' | 'newPassword'>(fetcher)

  return (
    <>
      <Button onClick={open} w="100%" rightIcon={<FiKey />}>Trocar senha</Button>

      <Modal opened={opened} onClose={close} title="Escolha uma nova senha">
        <fetcher.Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <TextInput
            mt={4}
            type="password"
            name="password"
            label="Senha atual"
            error={formErrors.password}
          />

          <TextInput
            mt={4}
            type="password"
            name="newPassword"
            label="Nova senha"
            error={formErrors.newPassword}
          />

          <Button
            mt={Object.keys(formErrors).length ? 'sm' : 'md'}
            loading={loading}
            type="submit"
            name="action"
            value="change-password"
            fullWidth
          >
            Confirmar
          </Button>
        </fetcher.Form>
      </Modal>
    </>
  )
}