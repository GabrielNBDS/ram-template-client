import { Button, Group } from "@mantine/core";
import { Link } from "@remix-run/react";
import ErrorPage from "~/components/ErrorPage";

export default function InvalidSignature() {
  return <ErrorPage 
    code={400}
    title="Invalid/Expired Signature"
    subtitle="The URL you're trying to access is invalid or expired."
  >
    <Group position="center">
      <Button component={Link} variant="subtle" size="md" to="/sign-up">
        Sign up again
      </Button>

      <Button component={Link} variant="subtle" size="md" to="/login">
        Login
      </Button>
    </Group>
  </ErrorPage>
}