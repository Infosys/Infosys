import React from "react";
import { UserTableRow } from "./UserTableRow";
import type { UserTableRowProps } from "./UserTableRow";

export type UserTableProps = {
  rows: UserTableRowProps[];
};

export const UserTable: React.FC<UserTableProps> = ({ rows }) => (
  <div
    style={{
      width: '100%',
      maxWidth: 1200,
      background: '#fff',
      borderRadius: 16,
      overflow: 'auto',
      boxShadow: '0 2px 12px 0 rgba(44,62,80,0.07)',
      fontFamily: 'Roboto, Arial, sans-serif',
      border: '1.5px solid #e3e8ee',
    }}
  >
    <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', tableLayout: 'fixed' }}>
      <thead>
        <tr style={{ background: '#fafbfc', color: '#222', fontWeight: 500, fontSize: 15, height: 48 }}>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 150, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif' }}>User</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 170, maxWidth: 200, whiteSpace: 'normal' }}>Official ID</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 180, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif' }}>Designation</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 120, maxWidth: 150, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',  fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif' }}>Role</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 170, maxWidth: 220, whiteSpace: 'normal' }}>Jurisdiction</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 100, maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',  fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif' }}>Status</th>
          <th style={{ textAlign: 'center', padding: '0 24px', fontWeight: 500, letterSpacing: 0.1, borderBottom: '1.5px solid #e3e8ee', minWidth: 90, maxWidth: 110, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' ,  fontFamily: 'Roboto Mono, Roboto, Arial, sans-serif'}}>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <UserTableRow key={row.officialId + idx} {...row} />
        ))}
      </tbody>
    </table>
  </div>
);
