import { Button, Center, Flex, Modal, UnstyledButton, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";
import { useDisclosure } from "@mantine/hooks";
import { FiTrash } from "react-icons/fi";

export default function RemoveAvatarDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme()

  const { fetcher, loading } = useRemixSubmit({
    queryKey: "remove-avatar",
    onSuccess: () => {
      close()
      notifications.show({
        message: 'Avatar removido',
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
        <fetcher.Form encType="multipart/form-data" method="post" action="/dashboard/me">
          <Flex w="100%" direction={{ base: 'column', md: 'row' }} gap={8}>
            <Button
              loading={loading}
              type="submit"
              name="action"
              value="remove-avatar"
              fullWidth
            >
              Confirmar
            </Button>
            <Button
              onClick={close}
              disabled={loading}
              type="button"
              variant="subtle"
              fullWidth
            >
              Cancelar
            </Button>
          </Flex>
        </fetcher.Form>
      </Modal>
    </>
  )
}