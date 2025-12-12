import React from "react";

export interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  style?: React.CSSProperties;
}

const ACTIVE_PINK = "#F7E4DB";

export const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style
}) => (
  <div
    style={{
      width: 530,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      gap: 36,
      ...style,
    }}
  >
    {tabs.map((tab,
      // idx
    ) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        style={{
          background: activeTab === tab ? ACTIVE_PINK : "transparent",
          color: "#232323",
          border: "none",
          borderRadius: 14,
          fontWeight: 400,
          fontSize: 18,
          fontFamily: "Inter, Arial, Helvetica, sans-serif",
          padding: "7px 24px",
          cursor: "pointer",
          outline: "none",
          transition: "background 0.2s, color 0.2s",
          whiteSpace: "nowrap",
          boxShadow: "none",
        }}
      >
        {tab}
      </button>
    ))}
  </div>
);