import React from "react";

export interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  color?: string;
  background?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  color = "#fff",
  background = "#F26B1A",
  icon,
  style = {},
}) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      background,
      color,
      border: "none",
      borderRadius: 7,
      fontWeight: 500,
      fontSize: 15,
       fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif',
      padding: "7px 18px",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      transition: "background 0.2s",
      ...style,
    }}
  >
    {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
    {label}
  </button>
);
