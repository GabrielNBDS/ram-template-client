import { createStyles, Navbar, Text, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link } from '@remix-run/react';
import { NavLink } from 'react-router-dom';
import { UserButton } from './UserButton';

const useStyles = createStyles((theme, _params) => {
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: `calc(${theme.spacing.md} * 1.5)`,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

      },
    },

    linkIcon: {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
      },
    },
  };
});

const data = [
  { link: 'users', label: 'Users' },
];

interface SidebarProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({ opened = false, setOpened }: SidebarProps) {
  const { classes, cx } = useStyles();
  const isMd = useMediaQuery('(min-width: 992px)');

  const links = data.map((item) => (
    <NavLink
      onClick={() => setOpened(false)}
      className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
      to={item.link}
      key={item.label}
    >
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Navbar h={opened ? 'calc(100vh - 60px)' : '100vh'} pos="fixed" top={opened ? '60px' : 0} display={(!isMd && !opened) ? 'none' : 'flex' } w={{ base: '100%', md: '300px' }} p="md">
      <Navbar.Section grow>
        {!opened && (
          <Text component={Link} to="/dashboard" weight="bold" display="block" pb={12} fz={24} px={12}>
            RAM template
          </Text>
        )}
        <Stack spacing={2}>
          {links}
        </Stack>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <UserButton />
      </Navbar.Section>
    </Navbar>
  );
}