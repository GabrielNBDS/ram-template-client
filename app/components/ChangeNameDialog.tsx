import { Box, Button, Paper, Text, TextInput, UnstyledButton, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';
import type { AdonisErrorItems } from '~/@types/AdonisError';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import useTransitionLoading from '~/utils/hooks/useTransitionLoading';
import useUser from '~/utils/hooks/useUser';

type TFields = 'name'

export default function ChangeNameDialog() {
  const [open, setOpen] = useState(false)

  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const theme = useMantineTheme()

  const actionData = useActionData() as { errors?: AdonisErrorItems[] }
  const formErrors = useGetFormErrors<TFields>(actionData?.errors)

  const { transition } = useRemixSubmit({
    queryKey: "change-name",
    onSuccess: () => {
      setOpen(false)
      notifications.show({
        title: 'Perfil atualizado',
        message: 'Seu nome foi atualizado',
      })
    },
  });

  const user = useUser()

  return (
    <Dialog.Root
      open={open}
      onOpenChange={state => setOpen(state)}
    >
      <Dialog.Trigger asChild>
        <UnstyledButton mx={8}>
          <FiEdit onClick={() => setOpen(true)} style={{ cursor: 'pointer' }} size={12} />
        </UnstyledButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Box pos="fixed" bg={theme.colors.dark[9]} sx={{ zIndex: 1001 }} inset={0} opacity={dark ? 0.6 : 0.3} />
        </Dialog.Overlay>
        <Dialog.Content>
          <Form method="post" action="/dashboard/me">
            <Paper
              sx={{ 
                zIndex: 1002,
                transform: 'translate(-20%, -50%)',
              }}
              w="100%"
              maw="420px"
              pos="fixed" 
              top="20%" 
              left="50%" 
              withBorder 
              shadow="md" 
              p={30} 
              radius="md"
            >
              <VisuallyHidden>
                <Dialog.Title>
                    Trocar nome
                </Dialog.Title>
              </VisuallyHidden>

              <Dialog.Description asChild>
                <Text>
                  Escolha um novo nome de usuário
                </Text>
              </Dialog.Description>

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

              <Dialog.Close asChild>
                <UnstyledButton pos="absolute" top={16} right={16}>
                  <FiX />
                </UnstyledButton>
              </Dialog.Close>
            </Paper>
          </Form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}