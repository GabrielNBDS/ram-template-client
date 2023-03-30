import {
  Paper,
  Title,
  Group,
  Button,
  Container,
  PasswordInput,
} from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import type { AdonisError } from '~/@types/AdonisError';
import FormErrorsList from '~/components/formErrorsList';
import { FiLock } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import getApi from '~/utils/getApi';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';
import updateUser from '~/utils/updateUser';

export const action: ActionFunction = async ({ request }) => {
  const api = await getApi(request)
  const formData = await request.formData()
  
  const password = formData.get('password')
  
  try {
    const { data } = await api.patch('/me/change-first-password', { password })
    
    const headers = await updateUser(request, data)
    
    return redirect('/dashboard', { headers });
  } catch (error) {
    return json({ errors: (error as AdonisError).response.data.errors })
  }
}

export default function FirstLogin() {
  const { fetcher, loading } = useRemixSubmit({})
  const formErrors = useGetFormErrors<'password'>(fetcher)

  return (
    <Container size={420} my={40}>
      <Title
        order={2}
        align="center"
        sx={{ fontSize: 24 }}
      >
        É seu primeiro login. Por favor, escolha uma nova senha.
      </Title>

      <fetcher.Form method="post">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <PasswordInput 
            error={formErrors.password}
            name="password"
            label="Nova senha"
            mt="md"
            mb="lg"
            icon={<FiLock />}
          />

          <FormErrorsList errors={fetcher.data?.errors} /> 

          <Group position="apart" mt={fetcher.data?.errors ? '-8px' : 'md'} sx={{ justifyContent: 'center'}}>
            <Button loading={loading} type="submit" fullWidth mt="xl">
              Trocar senha
            </Button>
          </Group>
        </Paper>
      </fetcher.Form>
    </Container>
  );
}