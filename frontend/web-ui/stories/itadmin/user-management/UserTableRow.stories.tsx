import type { Meta, StoryObj } from '@storybook/react';
import { UserTableRow } from '../../../src/app/features/it-admin-app-features/components/UserTableRow';
import type { UserTableRowProps } from '../../../src/app/features/it-admin-app-features/components/UserTableRow';

const meta: Meta<{ rows: UserTableRowProps[] }> = {
  title: 'ITAdmin/UserManagement/UserTableRow',
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'object', description: 'Array of user row data' },
    // onEdit/onDelete handled per row
  },
};
export default meta;
type Story = StoryObj<{ rows: UserTableRowProps[] }>;

export const MultipleRows: Story = {
  render: (args) => (
    <table style={{ borderCollapse: 'collapse', width: 900, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(44,62,80,0.04)' }}>
      <tbody>
        {args.rows.map((row, idx) => (
          <UserTableRow key={row.officialId + idx} {...row} />
        ))}
      </tbody>
    </table>
  ),
  args: {
    rows: [
      {
        user: 'Rajesh Kumar',
        officialId: 'BBMP/PTO/2024/001',
        designation: 'Property Tax Officer',
        role: 'Tax Officer',
        jurisdiction: 'Ward 24 (BBMP)',
        status: 'Active',
      },
      {
        user: 'Priya Sharma',
        officialId: 'BBMP/GIS/2024/012',
        designation: 'GIS Officer',
        role: 'GIS Admin',
        jurisdiction: 'City Level (BBMP)',
        status: 'Active',
      },
    ],
  },
};
