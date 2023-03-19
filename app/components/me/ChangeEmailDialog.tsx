import { Button, Modal, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { FiEdit } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useUser from '~/utils/hooks/useUser';

type TFields = 'email'

export default function ChangeEmailDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const { fetcher, loading } = useRemixSubmit({
    queryKey: "change-email",
    onSuccess: () => {
      close()
      notifications.show({
        title: 'E-mail atualizado',
        message: 'Seu e-mail foi atualizado.',
      })
    },
  });

  const formErrors = useGetFormErrors<TFields>(fetcher)

  const user = useUser()

  return (
    <>
      <UnstyledButton onClick={open} sx={{ cursor: 'pointer' }} mx={8}>
        <FiEdit size={12} />
      </UnstyledButton>
      <Modal opened={opened} onClose={close} title="Escolha um novo e-mail">
        <fetcher.Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <TextInput
            type="text"
            name="email"
            label="E-mail"
            error={formErrors.email}
            defaultValue={user.email}
          />

          <Button
            mt={Object.keys(formErrors).length ? 'sm' : 'md'}
            loading={loading}
            type="submit"
            name="action"
            value="change-email"
            fullWidth
          >
            Confirmar
          </Button>
        </fetcher.Form>
      </Modal>
      
    </>
  )
}