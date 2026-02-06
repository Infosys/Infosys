import type { Meta, StoryObj } from '@storybook/react';
import { TabSwitcher } from '../../../src/app/features/it-admin-app-features/components/TabSwitcher';
import React from 'react';

const meta: Meta<typeof TabSwitcher> = {
  title: 'ITAdmin/MapConfiguration/TabSwitcher',
  component: TabSwitcher,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: 'object' },
    // Removed isManageMaps, not a prop of TabSwitcher
    onTabChange: { action: 'tab-changed' },
    style: { control: false },
    activeTab: { table: { disable: true } },
  },
};
export default meta;
type Story = StoryObj<typeof TabSwitcher>;


import type { TabSwitcherProps } from '../../../src/app/features/it-admin-app-features/components/TabSwitcher';
const TabSwitcherStoryWrapper = (args: TabSwitcherProps) => {
  const tabs = ['Manage Maps', 'View Map Options'];
  const [showManageMaps, setShowManageMaps] = React.useState(true);
  const activeTab = showManageMaps ? tabs[0] : tabs[1];
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={showManageMaps}
          onChange={e => setShowManageMaps(e.target.checked)}
          style={{ marginRight: 8 }}
        />
        Show Manage Maps
      </label>
      <TabSwitcher
        {...args}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={args.onTabChange}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TabSwitcherStoryWrapper {...args} />,
  args: {
    tabs: ['Manage Maps', 'View Map Options'],
    activeTab: 'Manage Maps',
  },
};
