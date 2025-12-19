import React from "react";

export interface LayerVisibilityToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const LayerVisibilityToggle: React.FC<LayerVisibilityToggleProps> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    aria-pressed={checked}
    aria-disabled={disabled}
    onClick={() => !disabled && onChange?.(!checked)}
    style={{
      width: 38,
      height: 22,
      borderRadius: 12,
      background: checked ? '#F26B1A' : '#e6e6e6',
      border: 'none',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background 0.2s',
      outline: 'none',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      boxShadow: checked ? '0 1px 4px #f26b1a22' : 'none',
      opacity: disabled ? 0.6 : 1,
    }}
  >
    <span
      style={{
        display: 'block',
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        left: checked ? 18 : 4,
        top: 3,
        boxShadow: '0 1px 2px #0001',
        transition: 'left 0.2s',
      }}
    />
  </button>
);
