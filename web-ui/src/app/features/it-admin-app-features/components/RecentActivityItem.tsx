import React from "react";

export interface RecentActivityItemProps {
  icon?: React.ReactNode;
  label: string;
  subtext?: string;
  hoursAgo?: string;
}

export const RecentActivityItem: React.FC<RecentActivityItemProps> = ({ icon, label, subtext, hoursAgo }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "#f7fafd",
      borderRadius: 8,
      padding: "10px 16px",
      marginBottom: 10,
      minWidth: 180,
      minHeight: 44,
      boxShadow: "0 1px 2px rgba(44,62,80,0.04)",
      border: "1.2px solid #e3e8ee",
      gap: 12,
    }}
  >
    <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#eaf1f7", borderRadius: "50%" }}>
      {icon}
    </div>
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 32 }}>
      <span style={{ fontWeight: 600, fontSize: 15, color: "#222", marginTop: 0 }}>{label}</span>
      {subtext && <span style={{ fontSize: 13, color: "#6c757d", marginTop: 2 }}>{subtext}</span>}
      {hoursAgo && (
        <span style={{ fontSize: 12, color: "#b0b0b0", marginTop: 1, fontWeight: 400 }}>{hoursAgo}</span>
      )}
    </div>
  </div>
);
