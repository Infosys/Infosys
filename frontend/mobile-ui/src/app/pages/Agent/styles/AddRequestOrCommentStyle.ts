import type { SxProps, Theme } from "@mui/material";

export const pageContainerSx: SxProps<Theme> = {
  backgroundColor: "#ffffff",
  height: "100vh",
  width: "100%",
};

export const headerBoxSx: SxProps<Theme> = {
  fontFamily: "Roboto, Arial, sans-serif",
  p: 3,
  pt:4,
  backgroundColor: "#EEDCD2",
};

export const titleSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#000000",
  px:1,
};

export const subtitleSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 300,
  color: "#000000",
  fontStyle: "italic",
  px:1,
};

export const navButtonsBoxSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  gap: 2,
  alignItems: "center",
  justifyContent: "space-between",
  mt: 2,
};

export const navButtonSx: SxProps<Theme> = {
  backgroundColor: "rgba(255, 255, 255, 0.50)",
  color: "#c84c03",
  border: "2px solid #00000011",
  borderRadius: "16px",
  boxShadow: "none",
  textTransform: "none",
  fontWeight: 500,
  width: '40%',
};

export const navButtonTextSx: SxProps<Theme> = {
  fontWeight: 300,
  fontSize: 20,
};

export const formSectionSx: SxProps<Theme> = {
  p: 4,
};

export const textFieldSx: SxProps<Theme> = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
};

export const fileUploadBoxSectionSx: SxProps<Theme> = {
  mt: 4,
};

export const attachDocumentsTextSx: SxProps<Theme> = {
  mt: 1,
};

export const actionButtonsBoxSx: SxProps<Theme> = {
  mt: 4,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 2,
  justifyContent: "center",
};

export const cancelButtonSx: SxProps<Theme> = {
  borderRadius: "8px",
  mt: 2,
  color: "#c84c03",
  borderColor: "#c84c03",
  "&:hover": {
    borderColor: "#c84c03",
    backgroundColor: "#c84c0310",
  },
};

export const submitButtonSx: SxProps<Theme> = {
  borderRadius: "8px",
  mt: 2,
  backgroundColor: "#c84c03",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#a63c02",
  },
};