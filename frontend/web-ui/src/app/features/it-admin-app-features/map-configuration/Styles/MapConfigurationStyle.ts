import type { SxProps, Theme } from "@mui/material";

export const containerStylesSx: SxProps<Theme> = {
    backgroundColor: "#f5f5f5",
    pl:5,
    pr:2,
    pt:4,
    pb:2,
}

export const headerContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  mb: 2,
};

export const headerTitleSx: SxProps<Theme> = {
  fontSize: 32,
  fontWeight: 500,
  color: "black",
  p:0,
  m:0,
};

export const headerSubtitleSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 300,
  color: "black",
  p:0,
  m:0,
};

export const mapBoxSx: SxProps<Theme> = {
  borderRadius: "20px",
  p: 0,
  m: 0,
  maxHeight: "450px",
  width: "100%",
  overflow: "hidden",   
  position: "relative",  
};

export const ButtonContainerSx: SxProps<Theme> = {
  display:"flex",
  flexDirection:"row",
  justifyContent:"flex-end",
  gap:2,
  my:2,
}

export const viewMoreButtonSx: SxProps<Theme> = {
  backgroundColor: "#0B4B66",
  color: "#fff",
  borderRadius: "8px",
  fontWeight: 400,
  fontSize: 14,
  px: 2,
  py: 0,
  minWidth: 120,
  textTransform: "none",
  boxShadow: "0px 1px 4px 0px #00000014",
  "&:hover": {
    backgroundColor: "#08304a",
  },
};

export const CardListSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  gap: 2,
};

export const viewMapBoxSx: SxProps<Theme> = {
  borderRadius: "20px",
  p: 0,
  m: 0,
  maxHeight: "750px",
  width: "100%",
  overflow: "hidden",   
  position: "relative",  
  mt:2,
}

export const filterIconOverlaySx: SxProps<Theme> = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 10,
  background: "#fff",
  borderRadius: "50%",
  boxShadow: "0px 2px 8px rgba(0,0,0,0.12)",
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    background: "#fff",
  },
};

export const searchBarOverlaySx: SxProps<Theme> = {
  position: "absolute",
  top: 16,
  right: 16,
  zIndex: 10,
  width: 420,
  maxWidth: "90%",
};

export const viewMoreOverlaySx: SxProps<Theme> = {
  position: "absolute",
  bottom: 16,
  left: 16,
  zIndex: 10,
};

export const leftPanelSx: SxProps<Theme> = {
  position: "absolute",
  top: 0,
  left: 0,
  height: "100%",
  width: 320,
  background: "#fff",
  boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
  zIndex: 20,
  p: 2,
  display: "flex",
  flexDirection: "column",
};