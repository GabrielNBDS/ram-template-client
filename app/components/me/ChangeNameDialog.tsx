import { Button, Modal, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { FiEdit } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useUser from '~/utils/hooks/useUser';

export default function ChangeNameDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const { fetcher, loading } = useRemixSubmit({
    queryKey: "change-name",
    onSuccess: () => {
      close()
      notifications.show({
        message: 'Perfil atualizado',
      })
    },
  });

  const formErrors = useGetFormErrors<'name'>(fetcher)

  const user = useUser()

  return (
    <>
      <UnstyledButton mx={8} onClick={open} sx={{ cursor: 'pointer' }}>
        <FiEdit size={12} />
      </UnstyledButton>

      <Modal opened={opened} onClose={close} title="Escolha um novo nome de usuário">
        <fetcher.Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <TextInput
            mt={4}
            type="text"
            name="name"
            label="Nome"
            error={formErrors.name}
            defaultValue={user.name}
          />

          <Button
            mt={Object.keys(formErrors).length ? 'sm' : 'md'}
            loading={loading}
            type="submit"
            name="action"
            value="change-name"
            fullWidth
          >
            Confirmar
          </Button>
        </fetcher.Form>
      </Modal>
    </>
  )
}