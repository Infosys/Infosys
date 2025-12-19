import React from "react";

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  topItems: SidebarItem[];
  bottomItems: SidebarItem[];
  width?: number;
  backgroundColor?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'static' | 'sticky';
  top?: number | string;
  left?: number | string;
  style?: React.CSSProperties;
}

export const Sidebar: React.FC<SidebarProps> = ({
  topItems,
  bottomItems,
  width = 280,
  backgroundColor = "#a9c8d6",
  position = "fixed",
  // top = 0,
  left = 0,
  style = {},
}) => {
  return (
    <div
      style={{
        position,
        top: 0,
        left,
        bottom: 0,
        height: '100vh',
        minHeight: '100vh',
        width: width,
        background: backgroundColor,
        zIndex: 100,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, Arial, sans-serif",
        boxSizing: "border-box",
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '32px 0 32px 0' }}>
        <nav>
          {topItems.map((item, idx) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              Icon={item.icon}
              isActive={item.isActive}
              isFirst={idx === 0}
              onClick={item.onClick}
            />
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <div style={{ marginTop: 96, display: 'flex', flexDirection: 'column' }}>
          {bottomItems.map((
          item, 
          // idx
        ) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              Icon={item.icon}
              isActive={item.isActive}
              onClick={item.onClick}
            />
          ))}
          <div style={{ height: 120 }} />
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  label: string;
  Icon: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  isFirst?: boolean;
  collapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps & { isFirst?: boolean }> = ({
  Icon,
  label,
  isActive = false,
  isFirst = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: isFirst ? "0 32px 12px 32px" : "12px 32px",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: 18,
        color: "#181818",
        transition: "background 0.2s",
        background: isHovered ? "rgba(255, 255, 255, 0.2)" : "transparent",
      }}
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      onClick={onClick}
    >
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...(isActive && {
            background: "#36839d",
            borderRadius: "50%",
            padding: 6,
          }),
        }}
      >
        {React.createElement(Icon, {
          style: {
            width: isActive ? 20 : 28,
            height: isActive ? 20 : 28,
          },
          stroke: isActive ? "#fff" : "#181818",
        })}
      </div>
      <span style={{ fontWeight: 600, fontSize: 18 }}>{label}</span>
    </div>
  );
};

// Icon Components
export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

export const UserManagementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

export const DemandGenerationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <circle cx="8" cy="11" r="1.5" fill="currentColor" />
    <circle cx="11" cy="11" r="1.5" fill="currentColor" />
    <circle cx="14" cy="11" r="1.5" fill="currentColor" />
  </svg>
);

export const MasterDataIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

export const MapConfigIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const LocalisationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
  </svg>
);

export const AccessControlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const NotificationsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const HelpDeskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const LanguageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const ProfileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
  </svg>
);