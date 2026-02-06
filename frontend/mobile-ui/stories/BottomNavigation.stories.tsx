import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BottomNavigation from "../src/app/features/Agent/components/BottomNavigation";
import "../src/styles/BottomNavigation.css";

// NavigationTab type defines available tabs
type NavigationTab = 'home' | 'inbox' | 'notifications' | 'search';

const meta: Meta<typeof BottomNavigation> = {
  title: "Agent/BottomNavigation",
  component: BottomNavigation,
  parameters: {
    // show the canvas sized similarly to a mobile app
    layout: "fullscreen",
  },
  argTypes: {
    activeTab: {
      control: { type: 'select' },
      options: ['home', 'inbox', 'notifications', 'search'],
      description: 'Currently active tab',
    },
  },
};
export default meta;
type Story = StoryObj<typeof BottomNavigation>;

// Create a wrapper component that manages state properly
const InteractiveBottomNavigation: React.FC<{ initialTab: NavigationTab }> = ({ initialTab }) => {
  const [active, setActive] = React.useState<NavigationTab>(initialTab);
  
  return (
    <div className="mobile-app">
      {/* a small content area so the fixed bottom bar positions correctly */}
      <div className="main-content with-navigation" style={{ minHeight: 360, padding: 16 }} />
      <BottomNavigation
        activeTab={active}
        onTabChange={(t) => {
          setActive(t);
          console.log("BottomNavigation onTabChange:", t);
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    activeTab: "home",
  },
  render: (args) => <InteractiveBottomNavigation initialTab={args.activeTab} />,
};

export const InboxActive: Story = {
  args: {
    activeTab: "inbox",
  },
  render: (args) => <InteractiveBottomNavigation initialTab={args.activeTab} />,
};

export const NotificationsActive: Story = {
  args: {
    activeTab: "notifications",
  },
  render: (args) => <InteractiveBottomNavigation initialTab={args.activeTab} />,
};

export const SearchActive: Story = {
  args: {
    activeTab: "search",
  },
  render: (args) => <InteractiveBottomNavigation initialTab={args.activeTab} />,
};