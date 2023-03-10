interface AdonisError {
  response: {
    data: {
      errors: AdonisErrorItems[]
    }
  }
}

interface AdonisErrorItems {
  message: string;
  field: string;
  rule: string
}

export type { AdonisError, AdonisErrorItems }