import React from "react";

export interface RecalibrationHistoryCardProps {
  period: string;
  triggeredBy: string;
  date: string;
  properties: string;
  avgChange?: string;
  duration?: string;
}

export const RecalibrationHistoryCard: React.FC<RecalibrationHistoryCardProps> = ({
  period,
  triggeredBy,
  date,
  properties,
  avgChange,
  duration,
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 10,
      border: "1.5px solid #ececec",
      padding: "15px 18px 11px 18px",
      minWidth: 320,
      maxWidth: 500,
      minHeight: 82,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginBottom: 12,
      boxSizing: "border-box",
      position: "relative",
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
    }}
  >
    {/* Top bar: Period and Date */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 2,
      }}
    >
      <div style={{ fontWeight: 400, fontSize: 19, color: "#222", lineHeight: 1.14, letterSpacing: 0 }}>
        {period}
      </div>
      <div style={{ fontSize: 13, color: "#888", marginLeft: 8, whiteSpace: "nowrap", fontWeight: 400 }}>
        {date}
      </div>
    </div>
    {/* Triggered by */}
    <div style={{ fontSize: 13, color: "#444", margin: "0 0 10px 0", fontWeight: 400 }}>
      Triggered by {triggeredBy}
    </div>
    {/* Thin divider */}
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid #ececec",
        margin: "0 0 5px 0",
      }}
    />
    {/* Properties, Avg. Change, Duration (3 columns, baseline aligned) */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        width: "100%",
        fontSize: 13,
        color: "#222",
        fontWeight: 400,
      }}
    >
      {/* Properties Column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: "#888",
          fontWeight: 400,
          fontSize: 12.5,
          lineHeight: "17px",
          marginBottom: 0,
        }}>
          Properties
        </div>
        <div style={{
          color: "#222",
          fontWeight: 400,
          fontSize: 14,
        }}>
          {properties}
        </div>
      </div>
      {/* Avg. Change Column */}
      <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
        <div style={{
          color: "#888",
          fontWeight: 400,
          fontSize: 12.5,
          lineHeight: "17px",
          marginBottom: 0,
        }}>
          Avg. Change
        </div>
        <div style={{
          color: "#222",
          fontWeight: 400,
          fontSize: 14,
        }}>
          {avgChange || "-"}
        </div>
      </div>
      {/* Duration Column */}
      <div style={{ flex: 1, textAlign: "right", minWidth: 0 }}>
        <div style={{
          color: "#888",
          fontWeight: 400,
          fontSize: 12.5,
          lineHeight: "17px",
          marginBottom: 0,
        }}>
          Duration
        </div>
        <div style={{
          color: "#222",
          fontWeight: 400,
          fontSize: 14,
        }}>
          {duration || "-"}
        </div>
      </div>
    </div>
  </div>
);