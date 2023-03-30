import { Badge } from "@mantine/core";

export const roles = [
  { label: 'Administrador', value: 'admin', color: "grape" },
  { label :'Usuário', value: 'user', color: "blue" }
];

interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
  const currentRole = roles.find(r => r.value === role)

  return <Badge color={currentRole?.color}>{currentRole?.label}</Badge>
}