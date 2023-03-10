import { Alert } from "@mantine/core";
import { FiAlertCircle } from "react-icons/fi";
import type { AdonisErrorItems } from "~/@types/AdonisError";

interface Props {
  errors?: AdonisErrorItems[]
}

export default function FormErrorsList({ errors }: Props) {
  if(!errors || !errors.filter(error => !error.field)[0]) return null

  const error = errors.filter(error => !error.field)[0]

  return (
    <>
      <Alert styles={{ wrapper: { maxHeight: 21 }}} icon={<FiAlertCircle />} title={error.message} color="red">
      </Alert>
    </>
  )
}