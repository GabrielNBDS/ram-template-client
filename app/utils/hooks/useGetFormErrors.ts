import type { AdonisErrorItems } from "~/@types/AdonisError";


export default function useGetFormErrors<T extends string>(errors: AdonisErrorItems[] | undefined): Partial<Record<T, string>>  {
  if(!errors) return {}

  const formErrorsOnly = errors.filter(error => error.field)

  if(formErrorsOnly.length < 1) return {}

  const parsedErrors = {} as Record<T, string>

  formErrorsOnly.forEach(error => {
    if(error.message && error.field) {
      parsedErrors[error.field as T] = error.message
    }
  })

  return parsedErrors
}