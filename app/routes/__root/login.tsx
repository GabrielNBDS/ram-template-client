import {
  Paper,
  Title,
  Group,
  Button,
  TextInput,
  Container,
  PasswordInput,
} from '@mantine/core';
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { commitAuthSession, getAuthSession } from '~/cookies/auth.cookie';
import type { AdonisError } from '~/@types/AdonisError';
import FormErrorsList from '~/components/formErrorsList';
import { FiLock, FiMail } from 'react-icons/fi';
import useGetFormErrors from '~/utils/hooks/useGetFormErrors';
import getApi from '~/utils/api';
import { useRemixSubmit } from '~/utils/hooks/useRemixSubmit';

export const action: ActionFunction = async ({ request }) => {
  const api = await getApi()
  const formData = await request.formData()

  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const { data } = await api.post('/login', { email, password })

    const authSession = await getAuthSession(
      request.headers.get("Cookie")
    );

    authSession.set('user', { ...data })

    const headers = new Headers()
    headers.append('Set-Cookie', await commitAuthSession(authSession))
    return redirect('/dashboard', { headers });
  } catch (error) {
    return json({ errors: (error as AdonisError).response.data.errors })
  }
}

type TFields = 'email' | 'password' 

export default function Login() {
  const { fetcher, loading } = useRemixSubmit({})
  const formErrors = useGetFormErrors<TFields>(fetcher)

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={{ fontWeight: 900 }}
      >
        Bem-vindo
      </Title>

      <fetcher.Form method="post">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            type="email"
            error={formErrors.email}
            name="email"
            label="E-mail"
            icon={<FiMail />}
          />

          <PasswordInput 
            error={formErrors.password}
            name="password"
            label="Senha"
            mt="md"
            mb="lg"
            icon={<FiLock />}
          />

          <FormErrorsList errors={fetcher.data?.errors} /> 

          <Group position="apart" mt={fetcher.data?.errors ? '-8px' : 'md'} sx={{ justifyContent: 'center'}}>
            <Button loading={loading} type="submit" fullWidth mt="xl">
              Sign in
            </Button>
          </Group>
        </Paper>
      </fetcher.Form>
    </Container>
  );
}