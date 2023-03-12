import { Button, Modal, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Form, useActionData } from '@remix-run/react';
import { FiEdit } from 'react-icons/fi';
import type { AdonisErrorItems } from '~/@types/AdonisError';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useTransitionLoading from '~/utils/hooks/useTransitionLoading';
import useUser from '~/utils/hooks/useUser';

type TFields = 'email'

export default function ChangeEmailDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const actionData = useActionData() as { errors?: AdonisErrorItems[] }
  const formErrors = useGetFormErrors<TFields>(actionData?.errors)

  const { transition } = useRemixSubmit({
    queryKey: "change-email",
    onSuccess: () => {
      close()
      notifications.show({
        title: 'E-mail atualizado',
        message: 'Seu e-mail foi atualizado. Lembre-se de verificar seu e-mail para concluir as mudanças',
      })
    },
  });

  const user = useUser()

  return (
    <>
      <UnstyledButton onClick={open} sx={{ cursor: 'pointer' }} mx={8}>
        <FiEdit size={12} />
      </UnstyledButton>
      <Modal opened={opened} onClose={close} title={
        <>
          <Text>
            Escolha um novo e-mail.
          </Text>
          <Text color="dimmed">
            Um e-mail de confirmação será enviado ao seu novo endereço e seu e-mail só será atualizado ao confirmar.
          </Text>
      </>
      }>
        <Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <TextInput
            type="text"
            name="email"
            label="E-mail"
            error={formErrors.email}
            defaultValue={user.email}
          />

          <Button
            mt={actionData?.errors ? 'sm' : 'md'}
            loading={useTransitionLoading(transition)}
            type="submit"
            name="action"
            value="change-email"
            fullWidth
          >
            Confirmar
          </Button>
        </Form>
      </Modal>
      
    </>
  )
}