import { ActionIcon, Avatar, Box, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { FormEvent } from "react";
import { FiCamera } from "react-icons/fi";
import { useRemixSubmit } from "~/utils/hooks/useRemixSubmit";
import useUser from "~/utils/hooks/useUser";
import RemoveAvatarDialog from "./RemoveAvatarDialog";

export default function EditAvatar() {
  const { avatar } = useUser()

  const { fetcher, loading } = useRemixSubmit({
    queryKey: "change-avatar",
    onSuccess: () => {
      notifications.show({
        message: 'Avatar atualizado',
      })
    },
    onError: (data) => {
      const error = data?.errors.find((item: any) => item?.field === 'avatar')
      if(error?.message) {
        notifications.show({
          message: error?.message,
          color: 'red'
        })
      } else {
        notifications.show({
          message: 'Ocorreu um erro inesperado, por favor, tente novamente.',
          color: 'red'
        })
      }
    }
  });

  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()
	const dark = colorScheme === 'dark'

  function imageUpload(event: FormEvent<HTMLFormElement>) {
    const formData = event.currentTarget;
    const image = formData.querySelector("input[type=file]") as HTMLInputElement;
    if (image && image.files) {
        const selectedFile = image.files[0];
        if (selectedFile.size > 3 * 1024 * 1024) {
          notifications.show({
            message: 'O tamanho máximo do arquivo deve ser de 3mb',
            color: 'red'
          })
          return
        } else {
          const formData = new FormData(event.currentTarget)
          formData.set('action', 'update-avatar');
          fetcher.submit(formData, {
            encType: 'multipart/form-data',
            method: 'patch'
          })
        }
    } else {
      notifications.show({
        message: 'Ocorreu um erro. Tente novamente.',
        color: 'red'
      })
    }
  }

  return (
    <>
      <Box pos="relative">
        <Box>
          <Avatar
            w="128px"
            h="128px"
            sx={{ borderRadius: '50%' }}
            src={avatar?.url}
          />
          {avatar?.url && (
            <RemoveAvatarDialog />
          )}
        </Box>

        <fetcher.Form
          onChange={imageUpload}
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
            loading={loading}
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
        </fetcher.Form>
      </Box>
    </>
  ) 
}