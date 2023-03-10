import { Burger, Header, Text } from "@mantine/core";
import { Link } from "@remix-run/react";

interface ShellHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ShellHeader({ opened, setOpened }: ShellHeaderProps) {
  const title = opened ? 'Close navigation' : 'Open navigation';
  return (
    <Header display="flex" pos="fixed" height={60} p={12} sx={{ justifyContent: 'space-between', alignItems: 'center'}}>
      <Text onClick={() => setOpened(false)} component={Link} to="/dashboard" weight="bold" fz={24}>
        RAM template
      </Text>

      <Burger
        size="sm"
        opened={opened}
        onClick={() => setOpened((o) => !o)}
        title={title}
      />
    </Header>
  )
}