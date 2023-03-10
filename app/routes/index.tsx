import {
	Box,
	Button,
	Container,
	Stack,
	Text,
	Title,
} from '@mantine/core'
import { Link } from '@remix-run/react'
import ToggleThemeButton from '~/components/toggleThemeButton'

export default function Home() {
	return (
		<Box sx={{
      minHeight: '100vh',
			backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'6 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%235c5f66\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E");'
		}}>
			<Container sx={{
				paddingTop: 48,
				paddingBottom: 48,
				maxWidth: 800
			}}>
				<Stack align="center">
					<Stack spacing={1} justify="center">
						<Title
							sx={{
								fontSize: 48,
								'@media (max-width: 992px)': {
									fontSize: 36
								},
							}}
							align="center"
						>
              RAM Stack
						</Title>
						<Text color="dimmed" sx={{ fontSize: 24, textAlign: 'center' }}>
              Remix + Adonis + Mantine
						</Text>

					</Stack>

					<Text sx={{ textAlign: 'center' }}>
            The RAM Stack is named after the best girl in Re: Zero. Use it to
            build server-side react apps with a batteries-included backend api
            and build fast because of the ui kit.
					</Text>

          <Button component={Link} to="/login">Login</Button>

					<ToggleThemeButton />
				</Stack>
			</Container>
		</Box>
	)
}