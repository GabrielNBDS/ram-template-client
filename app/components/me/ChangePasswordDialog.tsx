import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Form, useActionData } from '@remix-run/react';
import { FiKey } from 'react-icons/fi';
import type { AdonisErrorItems } from '~/@types/AdonisError';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useTransitionLoading from '~/utils/hooks/useTransitionLoading';

type TFields = 'password' | 'newPassword'

export default function ChangePasswordDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const actionData = useActionData() as { errors?: AdonisErrorItems[] }
  const formErrors = useGetFormErrors<TFields>(actionData?.errors)

  const { transition } = useRemixSubmit({
    queryKey: "change-password",
    onSuccess: () => {
      close()
      notifications.show({
        title: 'Senha atualizada',
        message: 'Sua senha foi atualizada',
      })
    },
  });

  return (
    <>
      <Button onClick={open} w="100%" rightIcon={<FiKey />}>Trocar senha</Button>

      <Modal opened={opened} onClose={close} title="Escolha uma nova senha">
      <Form encType="multipart/form-data" method="post" action="/dashboard/me">
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
            mt={actionData?.errors ? 'sm' : 'md'}
            loading={useTransitionLoading(transition)}
            type="submit"
            name="action"
            value="change-password"
            fullWidth
          >
            Confirmar
          </Button>
        </Form>
      </Modal>
    </>
  )
}