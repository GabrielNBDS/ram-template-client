import { Button, Modal, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { FiPlus } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';

export default function NewUserDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const { fetcher, loading } = useRemixSubmit({
    queryKey: "create-user",
    onSuccess: () => {
      close()
      notifications.show({
        message: 'Usuário adicionado',
      })
    },
  });

  const formErrors = useGetFormErrors<'name' | 'email'>(fetcher)

  return (
    <>
      <Button onClick={open} rightIcon={<FiPlus />}>Novo Usuário</Button>

      <Modal opened={opened} onClose={close} title={
        <>
          <Text>Novo usuário</Text>
          <Text color="dimmed">
            A senha inicial é "123456".
            No primeiro login vai ser pedido para que o usuário mude.
          </Text>
        </>
      }>
        <fetcher.Form method="post" >
          <TextInput
            mt={4}
            type="text"
            name="name"
            label="Nome"
            error={formErrors.name}
          />

          <TextInput
            type="text"
            name="email"
            label="E-mail"
            error={formErrors.email}
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