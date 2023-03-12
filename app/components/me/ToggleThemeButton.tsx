import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { Form } from '@remix-run/react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function ToggleThemeButton() {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()
	const dark = colorScheme === 'dark'

	return (
		<Form encType="multipart/form-data" method="post" action="/dashboard/me">
			<ActionIcon
				variant="filled"
				color={dark ? 'yellow' : 'blue'}
				onClick={() => toggleColorScheme()}
				type="submit"
				name="action"
				value="toggle-theme"
			>
				{dark ? (
					<FiSun style={{ width: 18, height: 18 }} />
				) : (
					<FiMoon style={{ width: 18, height: 18 }} />
				)}
			</ActionIcon>
		</Form>
	)
}