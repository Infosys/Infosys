
import React from "react";
// Pencil (edit) and trash (delete) SVGs matching Figma style

export type UserTableRowProps = {
  user: string;
  officialId: string;
  designation: string;
  role: string;
  jurisdiction: string;
  status: 'Active' | 'Inactive';
  onEdit?: () => void;
  onDelete?: () => void;
};


export const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  officialId,
  designation,
  role,
  jurisdiction,
  status,
  onEdit,
  onDelete,
}) => (
  <tr
    style={{
      background: '#fff',
      borderBottom: '1.5px solid #000',
      fontSize: 15,
      fontFamily: 'Roboto, Arial, sans-serif',
      height: 48,
      transition: 'background 0.15s',
    }}
    onMouseOver={e => (e.currentTarget.style.background = '#f6f8fa')}
    onMouseOut={e => (e.currentTarget.style.background = '#fff')}
  >
    <td style={{ padding: '0 24px', fontWeight: 500, minWidth: 150, maxWidth: 180, verticalAlign: 'middle', border: 'none', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, Arial, sans-serif' }}>{user}</td>
    <td style={{ padding: '0 24px', color: '#444', minWidth: 170, maxWidth: 200, verticalAlign: 'middle', border: 'none', fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif', fontSize: 14, wordBreak: 'break-all', whiteSpace: 'normal' }}>
      {officialId.split('/').length > 1 ? (
        <span>
          <span>{officialId.split('/').slice(0, 2).join('/')}/</span>
          <br />
          <span>{officialId.split('/').slice(2).join('/')}</span>
        </span>
      ) : (
        officialId
      )}
    </td>
    <td style={{ padding: '0 24px', color: '#444', minWidth: 180, maxWidth: 220, verticalAlign: 'middle', border: 'none', whiteSpace: 'normal', wordBreak: 'break-word', fontFamily: 'Roboto, Arial, sans-serif' }}>{designation}</td>
    <td style={{ padding: '0 24px', minWidth: 120, maxWidth: 150, verticalAlign: 'middle', border: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <span
          style={{
            background: '#fff',
            border: '1.2px solid #000',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 13,
            fontWeight: 500,
            color: '#000',
            display: 'inline-block',
            width: 'auto',
            minWidth: 0,
            textAlign: 'center',
            fontFamily: 'Roboto, Arial, sans-serif',
            lineHeight: 1.3,
          }}
        >
          {role}
        </span>
      </div>
    </td>
    <td style={{ padding: '0 24px', color: '#444', minWidth: 170, maxWidth: 220, verticalAlign: 'middle', border: 'none', wordBreak: 'break-word', whiteSpace: 'nowrap', fontFamily: 'Roboto, Arial, sans-serif' }}>
      {jurisdiction}
    </td>
    <td style={{ padding: '0 24px', minWidth: 100, maxWidth: 120, verticalAlign: 'middle', border: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, Arial, sans-serif' }}>
      <span
        style={{
          background: status === 'Active' ? '#e6f7ec' : '#fbeaea',
          border: status === 'Active' ? '1.2px solid #7ed6a2' : '1.2px solid #f5a6a6',
          borderRadius: 6,
          padding: '2px 14px',
          fontSize: 13,
          fontWeight: 500,
          color: status === 'Active' ? '#1e824c' : '#c0392b',
          display: 'inline-block',
          minWidth: 60,
          textAlign: 'center',
          fontFamily: 'Roboto, Arial, sans-serif',
        }}
      >
        {status}
      </span>
    </td>
    <td style={{ padding: '0 24px', minWidth: 90, maxWidth: 110, verticalAlign: 'middle', border: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div style={{ display: 'flex', gap: 32, fontFamily: 'Roboto, Arial, sans-serif' }}>
        <button
          onClick={onEdit}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Edit"
        >
          {/* Pencil icon (edit) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#23506a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          title="Delete"
        >
          {/* Trash bin icon (delete) */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
);
