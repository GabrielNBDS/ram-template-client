import { Button, Center, Flex, Modal, UnstyledButton, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";
import { useDisclosure } from "@mantine/hooks";
import { FiTrash } from "react-icons/fi";
import useTransitionLoading from "~/utils/hooks/useTransitionLoading";
import { Form } from "@remix-run/react";

export default function RemoveAvatarDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme()

  const { transition } = useRemixSubmit({
    queryKey: "remove-avatar",
    onSuccess: () => {
      close()
      notifications.show({
        title: 'Avatar removido',
        message: 'Seu avatar foi removido',
      })
    },
  });

  return (
    <>
      <UnstyledButton
        onClick={open}
        pos="absolute"
        w="128px"
        h="128px"
        bg={theme.colors.dark[9]}
        opacity="0"
        top="0"
        sx={{
          cursor: 'pointer',
          borderRadius: '50%',
          transition: 'all 0.1s',
          zIndex: 1,
          '&:hover': {
            opacity: 0.6,
          },
        }}
      >
        <Center>
          <FiTrash color="white" size={36} />
        </Center>
      </UnstyledButton>

      <Modal opened={opened} onClose={close} title="Deseja mesmo remover seu avatar?">
        <Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <Flex w="100%" gap={8}>
            <Button
              loading={useTransitionLoading(transition)}
              type="submit"
              name="action"
              value="remove-avatar"
              fullWidth
            >
              Confirmar
            </Button>
            <Button
              onClick={close}
              disabled={useTransitionLoading(transition)}
              type="button"
              variant="subtle"
              fullWidth
            >
              Cancelar
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  )
}