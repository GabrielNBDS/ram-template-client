import { Button, Modal, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Form, useActionData } from '@remix-run/react';
import { FiEdit } from 'react-icons/fi';
import type { AdonisErrorItems } from '~/@types/AdonisError';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useTransitionLoading from '~/utils/hooks/useTransitionLoading';
import useUser from '~/utils/hooks/useUser';

type TFields = 'name'

export default function ChangeNameDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const actionData = useActionData() as { errors?: AdonisErrorItems[] }
  const formErrors = useGetFormErrors<TFields>(actionData?.errors)

  const { transition } = useRemixSubmit({
    queryKey: "change-name",
    onSuccess: () => {
      close()
      notifications.show({
        title: 'Perfil atualizado',
        message: 'Seu nome foi atualizado',
      })
    },
  });

  const user = useUser()

  return (
    <>
      <UnstyledButton mx={8} onClick={open} sx={{ cursor: 'pointer' }}>
        <FiEdit size={12} />
      </UnstyledButton>

      <Modal opened={opened} onClose={close} title="Escolha um novo nome de usuário">
        <Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <TextInput
            mt={4}
            type="text"
            name="name"
            label="Nome"
            error={formErrors.name}
            defaultValue={user.name}
          />

          <Button
            mt={actionData?.errors ? 'sm' : 'md'}
            loading={useTransitionLoading(transition)}
            type="submit"
            name="action"
            value="change-name"
            fullWidth
          >
            Confirmar
          </Button>
        </Form>
      </Modal>
    </>
  )
}