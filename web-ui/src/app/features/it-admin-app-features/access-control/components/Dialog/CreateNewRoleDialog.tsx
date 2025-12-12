import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { AppTextField } from '../InputFields/AppTextField';
import { AppDropdown } from '../InputFields/AppDropdown';
import { PermissionList } from '../PermissionList/PermissionList';
import type { Permission } from '../PermissionList/PermissionList';

const jurisdictionLevelOptions = ['Zone', 'Ward', 'City'];

const defaultPermissions: Permission[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'View', enabled: false },
  { key: 'properties', label: 'Properties', description: 'View, Create, Edit, Delete', enabled: false },
  { key: 'tax', label: 'Tax Calculation', description: 'View, Calculate, Approve', enabled: false },
  { key: 'gis', label: 'GIS/Maps', description: 'View, Edit, Upload, Delete', enabled: false },
  { key: 'users', label: 'Users', description: 'View, Edit, Upload, Delete', enabled: false },
  { key: 'reports', label: 'Reports', description: 'View, Generate, Export', enabled: false },
  { key: 'notifications', label: 'Notifications', description: 'View, Create, Send', enabled: false },
];

const CreateNewRoleDialog = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({
    roleName: '',
    roleDescription: '',
    jurisdictionLevel: '',
    jurisdiction: '',
  });

  const [permissions, setPermissions] = useState<Permission[]>(defaultPermissions);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTogglePermission = (key: string) => {
    setPermissions(perms =>
      perms.map(p =>
        p.key === key ? { ...p, enabled: !p.enabled } : p
      )
    );
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography fontSize={20} fontWeight={600}>Create New Role</Typography>
      </DialogTitle>
      <DialogContent>
        <AppTextField
          label="Role Name"
          value={form.roleName}
          onChange={val => handleChange('roleName', val)}
          placeholder="e.g. Field Agent"
        />
        <AppTextField
          label="Description"
          value={form.roleDescription}
          onChange={val => handleChange('roleDescription', val)}
          placeholder="Enter role description"
        />
        <AppDropdown
          label="Jurisdiction Level"
          value={form.jurisdictionLevel}
          options={jurisdictionLevelOptions}
          onChange={val => handleChange('jurisdictionLevel', val)}
        />
        <AppTextField
          label="Jurisdiction"
          value={form.jurisdiction}
          onChange={val => handleChange('jurisdiction', val)}
          placeholder="Select jurisdiction"
        />

        {/* Permissions Section */}
        <PermissionList
          permissions={permissions}
          onToggle={handleTogglePermission}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#c84c03',
            color: '#c84c03',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#c84c03',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            '&:hover': {
              backgroundColor: '#a63e02',
            },
          }}
          disabled={!form.roleName || !form.jurisdictionLevel}
          onClick={() => {
            // handle save logic here
            onClose();
          }}
        >
          Add Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNewRoleDialog;