import React from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface FilterDropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange?: (val: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  // label,
  options,
  value,
  onChange
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      minWidth: 180,
      fontFamily: "Inter, Arial, Helvetica, sans-serif",
    }}
  >
    <div
      style={{
        position: 'relative',
        border: '1.5px solid #000',
        borderRadius: 8,
        background: '#fff',
        minWidth: 180,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <select
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        style={{
          fontFamily: "inherit",
          fontSize: 15,
          fontWeight: 400,
          color: "#222",
          padding: "7px 34px 7px 14px",
          border: 'none',
          outline: 'none',
          background: 'transparent',
          borderRadius: 8,
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
          minWidth: 180,
          height: 34,
          boxSizing: "border-box",
          boxShadow: "none",
          cursor: "pointer",
          transition: "border 0.2s",
        }}
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ color: "#222" }}>
            {opt}
          </option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#222' }}>
        <ArrowDropDownIcon fontSize="medium" />
      </span>
    </div>
  </div>
);