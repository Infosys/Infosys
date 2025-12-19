import React from "react";
import EditSquareIcon from '@mui/icons-material/EditSquare';
export interface RoleCardProps {
  role: string;
  description: string;
  userCount: number;
  userLabel?: string;
  levelTag: string;
  requestCount: number;
  requestLabel?: string;
  selected?: boolean;
  onEdit?: () => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  description,
  userCount,
  userLabel = "users",
  levelTag,
  requestCount,
  requestLabel = "Requests",
  selected = false,
  onEdit,
}) => (
  <div
    style={{
      background: selected ? "#FFF6F2" : "#F5F5F5",
      borderRadius: 12,
      border: selected ? "2px solid #F26B1A" : "2px solid #e3e8ee",
      padding: "18px 20px 14px 20px",
      marginBottom: 14,
      boxSizing: "border-box",
      boxShadow: selected ? "0 2px 8px #f26b1a11" : "none",
      position: "relative",
      minWidth: 320,
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 0 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#000', marginRight: 10, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontFamily: 'Roboto, Arial, sans-serif' }}>
            {role}
          </span>
                  <span style={{
                    background: selected ? '#fff' : '#f5f5f5',
                    borderRadius: 12,
                    fontSize: 12,
                    padding: '2px 10px',
                    color: '#222',
                    marginLeft: 28,
                    fontWeight: 500,
                    marginRight: 0,
                    border: '1px solid #000',
                    fontFamily: 'Roboto, Arial, sans-serif',
                  }}>
            {userCount} {userLabel}
          </span>
        </div>
        <span style={{ fontSize: 14, color: '#000', marginBottom: 4, fontFamily: 'Roboto, Arial, sans-serif' }}>{description}</span>
      </div>
      {onEdit && (
        <button onClick={onEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, marginLeft: 8, marginTop: 2 }} title="Edit" aria-label="Edit">
          <EditSquareIcon sx={{ fontSize: 20, color: '#222' }} />
        </button>
      )}
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span style={{
                border: '1px solid #000',
                borderRadius: 8,
                fontSize: 12,
                padding: '1.5px 10px',
                color: '#2176AE',
                background: '#E6F0FA',
                fontWeight: 500,
                letterSpacing: 0.1,
                fontFamily: 'Roboto, Arial, sans-serif',
              }}>{levelTag}</span>
              <span style={{
                border: '1px solid #000',
                borderRadius: 8,
                fontSize: 12,
                padding: '1.5px 10px',
                color: '#666',
                background: selected ? '#fff' : '#F3F3F3',
                fontWeight: 500,
                letterSpacing: 0.1,
                fontFamily: 'Roboto, Arial, sans-serif',
              }}>{requestCount} {requestLabel}</span>
    </div>
  </div>
);
