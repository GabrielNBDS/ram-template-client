import { ActionIcon, Button, Flex, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FiTrash } from "react-icons/fi";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";

export default function DeleteUserDialog() {
  const [opened, { open, close }] = useDisclosure(false);

  const { fetcher, loading } = useRemixSubmit({
    queryKey: 'delete-user'
  });

  return (
    <>
      <ActionIcon onClick={open} color="red" variant="filled"><FiTrash /></ActionIcon>

      <Modal opened={opened} onClose={close} title="Quer mesmo deletar esse usuário?">
        <fetcher.Form method="post">
          <Flex w="100%" direction={{ base: 'column', md: 'row' }} gap={8}>
            <Button
              loading={loading}
              type="submit"
              name="action"
              value="delete-user"
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