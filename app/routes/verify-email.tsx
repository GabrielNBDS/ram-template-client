import {
  Paper,
  Title,
  Button,
  TextInput,
  Container,
  PasswordInput,
} from '@mantine/core';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/node';
import { Response } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { commitAuthSession, getAuthSession } from '~/cookies/auth.cookie';
import axios from 'axios';
import type { AdonisError, AdonisErrorItems } from '~/@types/AdonisError';
import FormErrorsList from '~/components/formErrorsList';
import { commitVerifyEmailSession, destroyVerifyEmailSession, getVerifyEmailSession } from '~/cookies/verify-email.cookies';

export const loader: LoaderFunction = async ({ request }) => {
  const verifyEmailSession = await getVerifyEmailSession(
    request.headers.get("Cookie")
  );

  const clientUrl = new URL(request.url);
  const signature = clientUrl.searchParams.get("signature");
  const urlToCall = !clientUrl.searchParams.get("url") ? verifyEmailSession.get("url") : `${clientUrl.searchParams.get("url")}&signature=${signature}`;

  if(!urlToCall) return redirect('/verify-email/invalid')
  
  try {
    const { data } = await axios.get(urlToCall)

    return new Response(JSON.stringify({ url: data.url }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": await destroyVerifyEmailSession(verifyEmailSession),
      },
    });
  } catch {
    return redirect('/verify-email/invalid')   
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const name = formData.get('name')
  const password = formData.get('password')
  const url = formData.get('url') as string | null

  if(!url) return redirect('/verify-email/invalid') 

  try {
    const { data } = await axios.patch(url, { name, password })

    const authSession = await getAuthSession(
      request.headers.get("Cookie")
    );
  
    authSession.set('user', data)
  
    return redirect('/dashboard', {
      headers: {
        "Set-Cookie": await commitAuthSession(authSession),
      },
    });
  } catch (error) {
    const verifyEmailSession = await getVerifyEmailSession(
      request.headers.get("Cookie")
    );
  
    verifyEmailSession.flash('url', request.url);

    const data = { errors: (error as AdonisError).response.data.errors }

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Set-Cookie": await commitVerifyEmailSession(verifyEmailSession),
      },
    });
  }
}

export default function VerifyEmail() {
  const { url } = useLoaderData<{ url: string }>()

  const actionData = useActionData() as { errors?: AdonisErrorItems[], url?: string }

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={{ fontWeight: 900 }}
      >
        Complete your account
      </Title>

      <Form method="post">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            required
            error={!!actionData?.errors?.find(error => error.field === 'name')}
            name="name"
            label="Name"
            placeholder="Your Name"
          />

          <PasswordInput
            required
            error={!!actionData?.errors?.find(error => error.field === 'password')}
            name="password"
            label="Password"
            placeholder="Your password"
            mt="md"
            mb="lg"
          />

          <input readOnly style={{ display: 'none' }} value={actionData?.url || url} name="url"></input>

          <FormErrorsList errors={actionData?.errors} /> 

          <Button type="submit" fullWidth mt={actionData?.errors ? 'md' : ' xl'}>
            Sign in
          </Button>
        </Paper>
      </Form>
    </Container>
  );
}