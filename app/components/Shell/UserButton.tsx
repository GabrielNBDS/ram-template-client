import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  createStyles,
} from '@mantine/core';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useUser from '~/utils/hooks/useUser';

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: '4px',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },
  },
}));


export function UserButton() {
  const { classes } = useStyles();
  const { name, email, avatar } = useUser()

  return (
    <UnstyledButton component={Link} to="/dashboard/me" className={classes.user}>
      <Group>
        <Avatar src={avatar?.url} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {email}
          </Text>
        </div>

        <FiChevronRight size={14} />
      </Group>
    </UnstyledButton>
  );
}