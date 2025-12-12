
import React from 'react';
import { Box, Typography } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import { RoleCard, type RoleCardProps } from '../../components/RoleCard';

interface SystemRolesListProps {
  roles: RoleCardProps[];
  selectedRole: string | null;
  onRoleSelect: (role: string) => void;
  onEditRole: (role: string) => void;
}

export const SystemRolesList: React.FC<SystemRolesListProps> = ({
  roles,
  selectedRole,
  onRoleSelect,
  onEditRole,
}) => {
  return (
    <Box sx={{ flex: 1, background: '#fff', borderRadius: '12px', p: 3, boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <ShieldOutlinedIcon sx={{ color: '#C84C0E', fontSize: 22, mr: 1.5 }} />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1f2937',
              fontFamily: 'Roboto',
            }}
          >
            System Roles
          </Typography>
        </Box>
      </Box>

      {/* Role Cards */}
      <Box>
        {roles.map((role) => (
          <div
            key={role.role}
            onClick={() => onRoleSelect(role.role)}
            style={{ cursor: 'pointer' }}
          >
            <RoleCard
              {...role}
              selected={selectedRole === role.role}
              onEdit={() => onEditRole(role.role)}
            />
          </div>
        ))}
      </Box>
    </Box>
  );
};
