import React from "react";

export interface RecalibrationStatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  highlightColor?: string;
}

export const RecalibrationStatsCard: React.FC<RecalibrationStatsCardProps> = ({
  title,
  value,
  subtext,
  highlightColor = "#000",
}) => (
  <div
    style={{
      background: "#D9D9D9",
      borderRadius: 12,
      boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)",
      padding: "18px 28px 16px 28px",
      width: '100%',
      height: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: `1.5px solid #ececec` ,
      marginBottom: 12,
      boxSizing: "border-box",
      fontFamily: 'Roboto, Arial, sans-serif',
    }}
  >
    <div style={{ color: highlightColor, fontWeight: 400, fontSize: 20, marginBottom: 6, fontFamily: 'Roboto, Arial, sans-serif', textAlign: 'center' }}>{title}</div>
    <div style={{ fontSize: 32, fontWeight: 500, color: "#222", lineHeight: '114%', fontFamily: 'Roboto, Arial, sans-serif', textAlign: 'center' }}>{value}</div>
    {subtext && <div style={{ fontSize: 14, color: "#6c757d", marginTop: 6, fontWeight: 500, fontFamily: 'Roboto, Arial, sans-serif', textAlign: 'center' }}>{subtext}</div>}
  </div>
);
