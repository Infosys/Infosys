import React from "react";

export interface ZoneCardProps {
  zoneName: string;
  count: string | number;
  onViewDetails?: () => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({
  zoneName,
  count,
  onViewDetails,
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      border: "2px solid #ececec",
      padding: "20px 36px",
      width: 370,
      minHeight: 110,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start", // <-- changed!
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
      boxSizing: "border-box",
    }}
  >
    {/* Left section: text */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{
        fontWeight: 400,
        fontSize: 20,
        color: "#000",
        marginBottom: 8,
        textAlign: "left"
      }}>
        {zoneName}
      </div>
      <div style={{
        fontSize: 20,
        fontWeight: 400,
        color: "#000",
        textAlign: "left"
      }}>
        {typeof count === "number" ? count.toLocaleString() : count}
      </div>
    </div>
    {/* Right section: arrow and view details - moved lower */}
    <button
      onClick={onViewDetails}
      style={{
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        color: "#222",
        textDecoration: "underline",
        fontWeight: 500,
        fontSize: 16,
        cursor: "pointer",
        padding: 0,
        marginLeft: 30,
        fontFamily: "inherit",
        marginTop: 32,            // <--- pushes button downward
      }}
    >
      {/* Use SVG for arrow */}
      <svg width="23" height="23" viewBox="0 0 18 18" fill="none" style={{ marginRight: 7 }}>
        <path d="M4 9h10M10 5l4 4-4 4" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      View Details
    </button>
  </div>
);