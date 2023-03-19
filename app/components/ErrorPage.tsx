import type { ReactNode } from 'react';
import React from 'react'
import { Title, Text, Button, Container, Group, Box, useMantineTheme } from '@mantine/core'
import { Link } from '@remix-run/react'

interface Props {
	code?: string | number;
	title?: string;
	subtitle?: string;
	showGoToHome?: boolean;
	children?: ReactNode;
}
const errorTitles: { [key: string]: { title: string; subtitle: string}} = {
	500: {
		title: 'Erro interno',
		subtitle: 'Ocorreu um erro inesperado por nossa parte. Por favor, tente novamente.'
	},
	404: {
		title: 'Página não encontrada',
		subtitle: 'A página desejada não foi encontrada. O endereço pode estar incorreto ou a página foi removida.'
	},
	403: {
		title: 'Página restrita',
		subtitle: 'Você não está autorizado a acessar esta página. Revise suas permissões ou contate o administrador.'
	}
}

export default function ErrorPage({ code = 500, title, subtitle, showGoToHome = false, children }: Props) {
	const theme = useMantineTheme()

	return (
		<Container py={80}>
			<Box sx={{
				textAlign: 'center',
				fontWeight: 900,
				fontSize: 220,
				lineHeight: 1,
				marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
				color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

				[theme.fn.smallerThan('sm')]: {
					fontSize: 120,
				},
			}}>
        {code}
			</Box>

			<Title sx={{
				textAlign: 'center',
				fontWeight: 900,
				fontSize: 38,

				[theme.fn.smallerThan('sm')]: {
					fontSize: 32,
				},
			}}>
        {title ?? errorTitles[code].title}
			</Title>

			<Text
				color="dimmed"
				size="lg"
				align="center"
				sx={{
					maxWidth: 500,
					margin: 'auto',
					marginTop: theme.spacing.xl,
					marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
				}}
			>
				{subtitle ?? errorTitles[code].subtitle}
			</Text>

			{showGoToHome && (
				<Group position="center">
					<Button component={Link} variant="subtle" size="md" to="/">
						Take me back to home page
					</Button>
				</Group>
			)}

			{children}
		</Container>
	)
}