import type { Meta, StoryObj } from '@storybook/react';
import { UserTable } from '../../../src/app/features/it-admin-app-features/components/UserTable';
import type { UserTableRowProps } from '../../../src/app/features/it-admin-app-features/components/UserTableRow';

const meta: Meta<{ rows: UserTableRowProps[] }> = {
  title: 'ITAdmin/UserManagement/UserTable',
  tags: ['autodocs'],
  argTypes: {
    rows: { control: 'object', description: 'Array of user row data' },
  },
};
export default meta;
type Story = StoryObj<{ rows: UserTableRowProps[] }>;

export const Default: Story = {
  render: (args) => <UserTable {...args} />, 
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
      {
        user: 'Anil Reddy',
        officialId: 'BBMP/FA/2024/089',
        designation: 'Field Agent',
        role: 'Verifier',
        jurisdiction: 'Ward 38 (BBMP)',
        status: 'Active',
      },
      {
        user: 'Lakshmi Menon',
        officialId: 'BBMP/DEO/2024/023',
        designation: 'Data Entry Operator',
        role: 'Data Entry',
        jurisdiction: 'Zone 3 (BBMP)',
        status: 'Active',
      },
      {
        user: 'Rohan Kumar',
        officialId: 'BBMP/PTO/2024/014',
        designation: 'Property Tax Officer',
        role: 'Tax Officer',
        jurisdiction: 'Ward 56(BBMP)',
        status: 'Active',
      },
    ],
  },
};
