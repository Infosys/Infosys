import React from "react";


export interface MapOverviewProps {
  mapImageUrl?: string;
  onViewMore?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  selectedZone?: 'Zone A' | 'Zone B' | 'Zone C';
}

const zoneMapImages: Record<string, string> = {
  'Zone A': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/India_location_map.svg/1200px-India_location_map.svg.png',
  'Zone B': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/BlankMap-India.png/1200px-BlankMap-India.png',
  'Zone C': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/India_map_blank_without_state_names.svg/1200px-India_map_blank_without_state_names.svg.png',
};

export const MapOverview: React.FC<MapOverviewProps> = ({
  mapImageUrl,
  onViewMore,
  searchValue = "",
  onSearchChange,
  selectedZone = 'Zone A',
}) => {
  const imageUrl = mapImageUrl || zoneMapImages[selectedZone] || zoneMapImages['Zone A'];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 8px 0 rgba(44, 62, 80, 0.07)",
        padding: 0,
        width: "100%",
        maxWidth: 900,
        margin: "0 auto",
        position: "relative",
        minHeight: 340,
        overflow: "hidden",
        border: "1.5px solid #ececec",
        marginBottom: 12,
      }}
    >
      {/* Search bar */}
      
<div
  style={{
    position: "absolute",
    top: 14,
    left: "64%", // move more right
    transform: "translateX(-40%)", // shift less to the left
    zIndex: 3,
    width: 400,
    maxWidth: "78%",
    pointerEvents: "none",
  }}
>
  <input
    type="text"
    placeholder="Search Zones"
    value={searchValue}
    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
    onClick={(e) => (e.currentTarget as HTMLInputElement).focus()}
    style={{
      pointerEvents: "auto",
      width: "100%",
      height: 22,
      padding: "6px 44px 6px 14px",
      borderRadius: 18,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      fontSize: 14,
      outline: "none",
      backgroundColor: "#fff",
      color: "#374151",
      backgroundImage:
        "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23343a40%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><circle cx=%2211%22 cy=%2211%22 r=%228%22></circle><line x1=%2221%22 y1=%2221%22 x2=%2216.65%22 y2=%2216.65%22></line></svg>')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "18px 18px",
      transition: "box-shadow 120ms ease, border-color 120ms ease",
    }}
  />
</div>
      {/* Map image */}
      <img
        src={imageUrl}
        alt={`Map overview for ${selectedZone}`}
        style={{
          width: "100%",
          height: 320,
          objectFit: "cover",
          borderRadius: 14,
          display: "block",
          filter: "grayscale(0.2)",
        }}
      />
      {/* View More button */}
      <button
        onClick={onViewMore}
        style={{
          position: "absolute",
          left: 24,
          bottom: 18,
          background: "#23506a",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "7px 22px",
          fontWeight: 500,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(44,62,80,0.08)",
        }}
      >
        View More
      </button>
    </div>
  );
};
