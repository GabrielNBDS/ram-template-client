import { Alert } from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { commitAuthSession, getAuthSession } from "~/cookies/auth.cookie";
import getApi from "~/utils/api";

export const loader: LoaderFunction = async ({ request }) => {
  const api = await getApi()
  const url = new URL(request.url);
  const email = url.searchParams.get('email')
  const currentEmail = url.searchParams.get('currentEmail')
  const signature = url.searchParams.get('signature')

  try {
    const { data } = await api.get(`/me/confirm-change-email?email=${email}&signature=${signature}&currentEmail=${currentEmail}`)


    const authSession = await getAuthSession(
      request.headers.get("Cookie")
    );

    authSession.set('user', { ...data })

    const headers = new Headers()
    headers.append('Set-Cookie', await commitAuthSession(authSession))

    return json({ success: true }, { headers })
  } catch (error) {
    return json({ success: false })
  }
}

export default function ConfirmChangeEmail() {
  const { success } = useLoaderData<{success: boolean}>()

  const navigate = useNavigate();

  function onClose() {
    navigate('/dashboard/me')
  }

  return (
  <Alert onClose={onClose} icon={success ? <FiCheckCircle size="1rem" /> :<FiAlertCircle size="1rem" /> } title={success ? 'E-mail alterado com sucesso' : 'Erro ao trocar e-mail'} color={success ? 'green' : 'red'} withCloseButton closeButtonLabel="Fechar alerta">
    {success
      ? 'A alteração do seu e-mail foi confirmada. A alteração deve ficar visível em até 60 segundos.'
      : 'Não foi possível trocar o e-mail pois o link é inválido ou expirou. Tente novamente.'
    }
  </Alert>
  )
}