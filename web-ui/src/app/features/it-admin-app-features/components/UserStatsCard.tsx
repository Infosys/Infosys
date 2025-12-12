import React from "react";

export interface UserStatsCardProps {
  title: string;
  value: string | number;
  highlightColor?: string;
}

export const UserStatsCard: React.FC<UserStatsCardProps> = ({
  title,
  value,
  highlightColor = "#000",
}) => (
  <div
    style={{
      background: "#D9D9D9",
      borderRadius: 10,
      border: 'none',
      padding: "18px 24px 16px 24px",
      width: 220,
      minHeight: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
      marginBottom: 8,
      boxSizing: "border-box",
      fontFamily: 'Roboto, Arial, sans-serif',
    }}
  >
    <div style={{ color: highlightColor, fontWeight: 400, fontSize: 20, marginBottom: 6, fontFamily: 'Roboto, Arial, sans-serif' }}>{title}</div>
    <div style={{ fontSize: 32, fontWeight: 500, color: "#222", letterSpacing: 1, fontFamily: 'Roboto, Arial, sans-serif' }}>{value}</div>
  </div>
);
