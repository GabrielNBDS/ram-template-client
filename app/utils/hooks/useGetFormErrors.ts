import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { AdonisErrorItems } from "~/@types/AdonisError";

export default function useGetFormErrors<T extends string>(fetcher: FetcherWithComponents<any>) {
  const [formErrors, setFormErrors] = useState<Partial<Record<T, string>>>({})
  
  useEffect(() => {
    const errors = fetcher?.data?.errors as AdonisErrorItems[] | undefined
    if(!errors) {
      setFormErrors({})
      return
    }

    const formErrorsOnly = errors.filter(error => error.field)

    if(formErrorsOnly.length < 1) {
      setFormErrors({})
      return
    }

    const parsedErrors = {} as Record<T, string>

    formErrorsOnly.forEach(error => {
      if(error.message && error.field) {
        parsedErrors[error.field as T] = error.message
      }
    })

    setFormErrors(parsedErrors)
  }
  , [fetcher])

  return formErrors
}