import type { SxProps, Theme } from "@mui/material";

export const dialogPaperSx: SxProps<Theme> = {
  borderRadius: "20px",
};

export const descriptionBoxSx: SxProps<Theme> = {
  mb: 2,
  mt: 0,
};

export const dragDropBoxSx: SxProps<Theme> = {
  border: "1.5px dashed #BDBDBD",
  borderRadius: "10px",
  p: 2,
  mb: 2,
  textAlign: "center",
  background: "#fafbfc",
  cursor: "pointer",
  position: "relative",
};

export const uploadedFilePaperSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  p: 1,
  mb: 1,
  borderRadius: "12px",
  border: "1px solid #E0E0E0",
  background: "#fff",
  position: "relative",
};

export const downloadButtonSx: SxProps<Theme> = {
  minWidth: 110,
  mr: 1,
  color: "#0B4B66",
  borderColor: "#0B4B66",
  borderRadius: "8px",
  fontWeight: 600,
  "&:hover": {
    borderColor: "#08304a",
    color: "#08304a",
  },
};

export const dialogActionsSx: SxProps<Theme> = {
  justifyContent: "center",
  pb: 2,
  px: 3,
  display: "flex",
  flexDirection: "row",
  gap: 2,
};

export const cancelButtonSx: SxProps<Theme> = {
  color: "#0B4B66",
  borderColor: "#0B4B66",
  fontWeight: 600,
  borderRadius: "8px",
  flex: 1,
  minWidth: 0,
};

export const submitButtonSx: SxProps<Theme> = {
  backgroundColor: "#0B4B66",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "8px",
  flex: 1,
  minWidth: 0,
  "&:hover": { backgroundColor: "#08304a" },
};