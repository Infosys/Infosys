import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RoleCard, type RoleCardProps } from '../../../app/features/it-admin-app-features/components/RoleCard';

const meta: Meta<typeof RoleCard> = {
  title: 'ITAdmin/AccessControl/RoleCardList',
  component: RoleCard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RoleCard>;

const roles: RoleCardProps[] = [
  {
    role: 'Super Admin',
    description: 'Full system access',
    userCount: 5,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 1,
    requestLabel: 'Request',
    onEdit: () => {},
  },
  {
    role: 'Field Agent',
    description: 'Property verification',
    userCount: 890,
    userLabel: 'users',
    levelTag: 'ward level',
    requestCount: 7,
    requestLabel: 'Requests',
    onEdit: () => {},
  },
  {
    role: 'Service Manager',
    description: 'Property tax management',
    userCount: 15,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 1,
    requestLabel: 'Request',
    onEdit: () => {},
  },
  {
    role: 'GIS Admin',
    description: 'Map data management',
    userCount: 5,
    userLabel: 'users',
    levelTag: 'city level',
    requestCount: 4,
    requestLabel: 'Requests',
    onEdit: () => {},
  },
];

export const InteractiveList: Story = {
  render: () => {
    const [selectedIdx, setSelectedIdx] = useState(0);
    return (
      <div style={{ maxWidth: 440 }}>
        {roles.map((props, idx) => (
          <div key={props.role} onClick={() => setSelectedIdx(idx)} style={{ cursor: 'pointer' }}>
            <RoleCard {...props} selected={selectedIdx === idx} />
          </div>
        ))}
      </div>
    );
  },
};
