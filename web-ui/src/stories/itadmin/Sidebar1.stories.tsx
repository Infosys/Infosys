import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "../../app/features/it-admin-app-features/components/Sidebar";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import hindiEnglishIcon from '../../app/components/Sidebar/assets/hindi_english_icon.svg';

const HindiEnglishIcon = () => (
  <img src={hindiEnglishIcon} alt="Language" width={25} height={25} />
);
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import type { SidebarProps } from "../../app/features/it-admin-app-features/components/Sidebar";
import type { StoryContext } from "@storybook/react";


// Immutable originals for label/state preservation
const topItemsOriginal = [
  { label: "Dashboard", icon: DashboardOutlinedIcon, originalLabel: "Dashboard" },
  { label: "User Management", icon: TaskAltOutlinedIcon, originalLabel: "User Management" },
  { label: "Demand Generation", icon: SearchOutlinedIcon, originalLabel: "Demand Generation" },
  { label: "Master Data", icon: StorageRoundedIcon, originalLabel: "Master Data" },
  { label: "Map Configuration", icon: MapOutlinedIcon, originalLabel: "Map Configuration" },
  { label: "Localisation", icon: MenuBookRoundedIcon, originalLabel: "Localisation" },
  { label: "Access Control", icon: ShieldOutlinedIcon, originalLabel: "Access Control" },
  { label: "Notifications", icon: NotificationsOutlinedIcon, originalLabel: "Notifications" },
];
const bottomItemsOriginal = [
  { label: "Help Desk", icon: ErrorOutlineOutlinedIcon, originalLabel: "Help Desk" },
  { key: 'language', label: 'Language', icon: HindiEnglishIcon, group: 'secondary', originalLabel: "Language" },
  { label: "Profile", icon: AccountCircleOutlinedIcon, originalLabel: "Profile" },
  { label: "Settings", icon: SettingsOutlinedIcon, originalLabel: "Settings" },
];

const NAV_OPTIONS = [
  "Dashboard",
  "User Management",
  "Demand Generation",
  "Master Data",
  "Map Configuration",
  "Localisation",
  "Access Control",
  "Notifications",
  "Help Desk",
  "Language",
  "Profile",
  "Settings"
];

const getSidebarItems = (
  selectedNav: string,
  setSelectedNav: (label: string) => void
) => {
  return {
    topWithClick: topItemsOriginal.map((item) => ({
      ...item,
      label: item.originalLabel,
      isActive: selectedNav === item.originalLabel,
      onClick: () => setSelectedNav(item.originalLabel),
    })),
    bottomWithClick: bottomItemsOriginal.map((item) => ({
      ...item,
      label: item.originalLabel,
      isActive: selectedNav === item.originalLabel,
      onClick: () => setSelectedNav(item.originalLabel),
    }))
  };
};

const meta: Meta<SidebarProps & { selectedNav?: string }> = {
  title: "ITAdmin/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen"
  },
  argTypes: {
    selectedNav: {
      control: "select",
      options: NAV_OPTIONS,
      description: "Currently selected navigation item",
      defaultValue: "Dashboard"
    }
  }
};
export default meta;

type Story = StoryObj<SidebarProps & { selectedNav?: string }>;

export const Default: Story = {
  render: (
    args: SidebarProps & { selectedNav?: string },
    context: StoryContext<SidebarProps & { selectedNav?: string }>
  ) => {
    const updateArgs = context.updateArgs!;
    const selectedNav = args.selectedNav ?? "Dashboard";
    const width = args.width || 280;
    const { topWithClick, bottomWithClick } = getSidebarItems(
      selectedNav,
      (label) => updateArgs({ selectedNav: label })
    );
    return (
      <div style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar
            {...args}
            width={width}
            topItems={topWithClick}
            bottomItems={bottomWithClick}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
            <h1 style={{ fontSize: 32, color: "#222", fontWeight: 700, textAlign: "center" }}>{selectedNav}</h1>
            <p style={{ textAlign: "center" }}>Click navigation items or use controls section.</p>
          </div>
        </div>
      </div>
    );
  },
  args: {
    width: 280,
    backgroundColor: "#a9c8d6",
    position: "fixed",
    top: "0",
    left: "0",
    selectedNav: "Dashboard"
  },
  parameters: {
    controls: { expanded: true }
  }
};


export const ActiveDashboard: Story = {
  render: (
    args: SidebarProps & { open?: boolean; selectedNav?: string },
    context: StoryContext<SidebarProps & { open?: boolean; selectedNav?: string }>
  ) => {
    const updateArgs = context.updateArgs!;
    const open = args.open ?? true;
    const selectedNav = "Dashboard";
    const width = open ? args.width || 280 : 76;
    const { topWithClick, bottomWithClick } = getSidebarItems(selectedNav, (label) => updateArgs({ selectedNav: label }));
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          {...args}
          width={width}
          topItems={topWithClick}
          bottomItems={bottomWithClick}
        />
        <div style={{ flex: 1, padding: "20px" }}>
          <button
            onClick={() => updateArgs({ open: !open })}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {open ? 'Collapse' : 'Expand'} Sidebar
          </button>
          <h1 style={{ fontSize: 32, color: "#222", fontWeight: 700 }}>{selectedNav}</h1>
          <p>Click navigation items or use controls section.</p>
        </div>
      </div>
    );
  },
  args: {
    width: 280,
    backgroundColor: "#a9c8d6",
    position: "relative",
    top: "0",
    left: "0",
    // open: true,
    selectedNav: "Dashboard"
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story: 'Sidebar with Dashboard navigation item highlighted as active.',
      },
    },
  },
};

export const DarkTheme: Story = {
  render: (
    args: SidebarProps & { open?: boolean; selectedNav?: string },
    context: StoryContext<SidebarProps & { open?: boolean; selectedNav?: string }>
  ) => {
    const updateArgs = context.updateArgs!;
    const open = args.open ?? true;
    const selectedNav = args.selectedNav ?? "Dashboard";
    const width = open ? args.width || 280 : 76;
    const { topWithClick, bottomWithClick } = getSidebarItems(selectedNav, (label) => updateArgs({ selectedNav: label }));
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          {...args}
          width={width}
          topItems={topWithClick}
          bottomItems={bottomWithClick}
        />
        <div style={{ flex: 1, padding: "20px" }}>
          <button
            onClick={() => updateArgs({ open: !open })}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {open ? 'Collapse' : 'Expand'} Sidebar
          </button>
          <h1 style={{ fontSize: 32, color: "white", fontWeight: 700 }}>{selectedNav}</h1>
          <p style={{ color: "white" }}>Click navigation items or use controls section.</p>
        </div>
      </div>
    );
  },
  args: {
    width: 280,
    backgroundColor: "#2c3e50",
    position: "relative",
    top: "0",
    left: "0",
    // open: true,
    selectedNav: "Dashboard"
  },
  parameters: {
    controls: { expanded: true },
    docs: {
      description: {
        story: 'Sidebar with dark theme background color.',
      },
    },
  },
};