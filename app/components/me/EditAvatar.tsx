import { ActionIcon, Avatar, Box, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Form } from "@remix-run/react";
import { FiCamera } from "react-icons/fi";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";
import useTransitionLoading from "~/utils/hooks/useTransitionLoading";
import useUser from "~/utils/hooks/useUser";
import RemoveAvatarModal from "./RemoveAvatarModal";

export default function EditAvatar() {
  const { avatar } = useUser()

  const { transition, submit } = useRemixSubmit({
    queryKey: "change-avatar",
    onSuccess: () => {
      notifications.show({
        title: 'Avatar atualizado',
        message: 'Seu avatar foi atualizado',
      })
    },
  });

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
	const dark = colorScheme === 'dark'

  return (
    <Box pos="relative">
      <Box>
        <Avatar
          w="128px"
          h="128px"
          sx={{ borderRadius: '50%' }}
          src={avatar?.url}
        />
        {avatar?.url && (
          <RemoveAvatarModal />
        )}
      </Box>

      <Form
        onChange={(event) => {
          submit(event.currentTarget, {
            encType: 'multipart/form-data',
            method: 'patch'
          })
        }}
        method="post" 
        action="/dashboard/me"
      >
        <ActionIcon
          component="label"
          htmlFor="avatar"
          bottom="0px"
          right="0px"
          radius="xl"
          pos="absolute"
          color="blue"
          variant="filled"
          sx={{
            zIndex: 2,
            border: `2px solid ${dark ? theme.colors.dark[6] : theme.white}`
          }}
          loading={useTransitionLoading(transition) && transition.submission?.action === '/dashboard/me'}
        >
          <FiCamera />
        </ActionIcon>
        <input
          onClick={e => {
            (e.target as any).value = null;
          }}
          tabIndex={0}
          style={{ display: 'none' }}
          id="avatar" 
          name="avatar" 
          type="file"
        ></input>
        <input
          tabIndex={0}
          style={{ display: 'none' }}
          type="submit"
          name="action"
          value="change-avatar"
        />
      </Form>
    </Box>
  ) 
}