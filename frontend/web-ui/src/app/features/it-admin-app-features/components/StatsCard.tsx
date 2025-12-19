import React from "react";



export interface StatsCardSubstat {
  value: string | number;
  label: string;
}

export interface StatsCardProps {
  title: string;
  value?: string | number;
  substats?: StatsCardSubstat[];
  subtext?: string | string[];
  highlightColor?: string;
  width?: number | string;
  children?: React.ReactNode;
}




export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  substats,
  subtext,
  highlightColor = "#C84C0E",
  width = 275,
  children,
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 10,
      boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)",
      padding: "14px 16px 12px 16px",
      width,
      minHeight: 90,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      border: `1.5px solid #ececec` ,
      marginRight: 16,
      marginBottom: 8,
      boxSizing: "border-box",
      fontFamily: 'Roboto, Arial, sans-serif',
    }}
  >
    <div style={{ color: highlightColor, fontWeight: 700, fontSize: 20, marginBottom: 2, fontFamily: 'Roboto, Arial, sans-serif', lineHeight: '1.2' }}>{title}</div>
    {substats && substats.length > 0 ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 8 }}>
        {substats.map((stat, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{
              fontSize: 40,
              color: '#222',
              fontWeight: 200,
              opacity: 1,
              lineHeight: '114%',
              fontFamily: 'Roboto, Arial, sans-serif',
            }}>{stat.value}</span>
            <span style={{ fontSize: 13, color: '#6c757d', fontWeight: 500, marginTop: 2, fontFamily: 'Roboto, Arial, sans-serif' }}>{stat.label}</span>
          </div>
        ))}
      </div>
    ) : (
      value !== undefined && <div style={{
        fontSize: 40,
        color: "#222",
        fontWeight: 200,
        opacity: 1,
        lineHeight: '114%',
        margin: "2px 0 0 0",
        letterSpacing: 1,
        fontFamily: 'Roboto, Arial, sans-serif',
      }}>{value}</div>
    )}
    {Array.isArray(subtext) ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
        {subtext.map((txt, idx) => {
          const isPositive = typeof txt === 'string' && /\+\d+(\.\d+)?%/.test(txt);
          return (
            <span
              key={idx}
              style={{
                fontSize: 13,
                color: isPositive ? '#1ca14b' : '#6c757d',
                fontWeight: 500,
                flex: 1,
                textAlign: 'center',
                fontFamily: 'Roboto, Arial, sans-serif',
              }}
            >
              {txt}
            </span>
          );
        })}
      </div>
    ) : (
      subtext && (
        <div
          style={{
            fontSize: 13,
            color:
              typeof subtext === 'string' && /\+\d+(\.\d+)?%/.test(subtext)
                ? '#1ca14b'
                : '#6c757d',
            marginTop: 4,
            fontWeight: 500,
            fontFamily: 'Roboto, Arial, sans-serif',
          }}
        >
          {subtext}
        </div>
      )
    )}
    {children}
  </div>

);
