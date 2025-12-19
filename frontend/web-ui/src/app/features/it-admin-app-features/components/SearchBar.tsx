import React from "react";

export interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder = "Search by name, ID, or email", onChange }) => (
  <div style={{ position: 'relative', width: 400 }}>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange && onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 38px 10px 14px',
        borderRadius: 8,
        border: '1.5px solid #222',
        fontSize: 15,
        background: '#fff',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    />
    <svg
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}
      width="18" height="18" fill="none" stroke="#23506a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="7" />
      <line x1="14" y1="14" x2="17" y2="17" />
    </svg>
  </div>
);
