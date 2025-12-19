import { Box, Typography, Stack } from "@mui/material";
import AntSwitch from "../../../components/AntSwitch";

export interface Permission {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface PermissionListProps {
  permissions: Permission[];
  onToggle: (key: string) => void;
}

export const PermissionList: React.FC<PermissionListProps> = ({
  permissions,
  onToggle,
}) => (
  <Box sx={{ backgroundColor: "#f5f5f5", borderRadius: 3, p: 2, mt: 2 }}>
    {permissions.map((perm) => (
      <Stack
        key={perm.key}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography fontWeight={500} fontSize={16}>{perm.label}</Typography>
          <Typography fontSize={13} color="text.secondary">
            {perm.description}
          </Typography>
        </Box>
        <AntSwitch
        checked={perm.enabled}
        onChange={() => onToggle(perm.key)}
        />
      </Stack>
    ))}
  </Box>
);