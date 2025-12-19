import React from "react";

export interface MapStatsCardProps {
  title: string;
  value: string | number;
}

export const MapStatsCard: React.FC<MapStatsCardProps> = ({ title, value }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 8,
      border: "2px solid #222",
      padding: "18px 24px 16px 24px",
      width: 210,
      minHeight: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 18,
      marginBottom: 8,
      boxSizing: "border-box",
    }}
  >
    <div style={{ color: "#000", fontWeight: 400, fontSize: 20, marginBottom: 6, textAlign: 'center' }}>{title}</div>
    <div style={{ fontSize: 32, fontWeight: 600, color: "#000", letterSpacing: 1 }}>{value}</div>
  </div>
);
