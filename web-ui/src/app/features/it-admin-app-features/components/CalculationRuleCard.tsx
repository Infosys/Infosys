import React from "react";

export interface CalculationRuleCardProps {
  title: string;
  formula: string;
  date?: string;
  onEdit?: () => void;
}

export const CalculationRuleCard: React.FC<CalculationRuleCardProps> = ({
  title,
  formula,
  date,
  onEdit,
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 10,
      border: "1.5px solid #ececec",
      padding: "13px 16px 18px 16px",
      minWidth: 400,
      maxWidth: 520,
      minHeight: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginBottom: 12,
      boxSizing: "border-box",
      position: "relative",
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
    }}
  >
    {onEdit && (
      <button
        onClick={onEdit}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          margin: 0,
          display: "flex",
          alignItems: "center",
        }}
        title="Edit"
        aria-label="Edit"
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 0 0 .707-.293l9.414-9.414a2 2 0 0 0 0-2.828l-3.172-3.172a2 2 0 0 0-2.828 0L4 15.414V20z"/>
        </svg>
      </button>
    )}
    <div
      style={{
        fontWeight: 400,
        fontSize: 17,
        color: "#222",
        marginBottom: 2,
        lineHeight: 1.17,
        textAlign: "left",
        letterSpacing: 0,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 13,
        fontWeight: 400,
        color: "#444",
        marginBottom: 10,
        lineHeight: "18px",
        textAlign: "left",
        letterSpacing: 0,
        whiteSpace: "pre-line",
      }}
    >
      {formula}
    </div>
    {date && (
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 8,
          background: '#f6f6f6',
          borderRadius: 12,
          padding: '2px 12px',
          fontSize: 11,
          color: '#b2b2b2',
          fontWeight: 400,
          lineHeight: '15px',
          textAlign: 'center',
          minWidth: 0,
          boxShadow: 'none',
          border: 'none',
          letterSpacing: 0,
        }}
      >
        {date}
      </div>
    )}
  </div>
);