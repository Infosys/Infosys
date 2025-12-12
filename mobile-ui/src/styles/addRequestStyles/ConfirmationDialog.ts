import type { SxProps, Theme } from "@mui/material";

export const confirmDialogPaperStyle: SxProps<Theme> = {
  borderRadius: "20px",
  minWidth: 390,
  maxWidth: 410,
  p: 0,
  boxShadow: "0px 6px 36px 0px rgba(36, 66, 117, 0.19)",
};

export const confirmTitleStyle: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "20px",
  mt: 3.5,
  mb: 2,
  textAlign: "center",
  color: "#1C2237",
  letterSpacing: 0.2,
};

export const confirmDescStyle: SxProps<Theme> = {
  color: "#4F566B",
  fontSize: "15.3px",
  fontWeight: 500,
  lineHeight: 1.44,
  px: 4.6,
  mb: 2.2,
  textAlign: "center",
};

export const confirmNoteStyle: SxProps<Theme> = {
  color: "#77809A",
  fontSize: "14px",
  fontWeight: 400,
  textAlign: "center",
  px: 4,
  mb: 2,
};

export const confirmButtonBar: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  gap: 2.3,
  px: 4,
  mb: 4,
};

export const rejectBtn: SxProps<Theme> = {
  border: "1.6px solid #0B4B66",
  color: "#0B4B66",
  bgcolor: "#fff",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "15.2px",
  height: "38px",
  width: "125px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#EBF2FF",
    borderColor: "#0B4B66",
  },
};

export const confirmBtn: SxProps<Theme> = {
  border: "1.6px solid #0B4B66",
  bgcolor: "#0B4B66",
  color: "#fff",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "15.2px",
  height: "38px",
  width: "125px",
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#082e44",
    borderColor: "#0B4B66",
  },
};

export const closeButtonStyle: SxProps<Theme> = {
  position: "absolute",
  right: 13,
  top: 16,
  bgcolor: "#F3F8FA",
  color: "#0B4B66",
  width: 33,
  height: 33,
  borderRadius: "50%",
  minWidth: 0,
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#ebf3fa",
  },
};