import type { SxProps, Theme } from "@mui/material";

export const requestDialogPaperStyle: SxProps<Theme> = {
  borderRadius: "16px",
  minHeight: "300px",
  boxShadow: "0px 6px 36px 0px rgba(36, 66, 117, 0.19)",
};

export const requestDialogTitleStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  pb: 1,
  fontWeight: 600,
  fontSize: "18px",
  color: "#1C2237",
};

export const requestDialogContentStyle: SxProps<Theme> = {
  pb: 1,
};

export const requestTextFieldStyle: SxProps<Theme> = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
  "& .MuiInputLabel-root": {
    color: "#4F566B",
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "14px",
  },
};

export const fileUploadBoxStyle: SxProps<Theme> = {
  border: "2px dashed #ccc",
  borderRadius: "8px",
  p: 2,
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#999",
  },
};

export const uploadIconStyle: SxProps<Theme> = {
  fontSize: 48,
  color: "#ccc",
  mb: 1,
};

export const uploadTextStyle: SxProps<Theme> = {
  color: "#4F566B",
  fontSize: "14px",
};

export const requestDialogActionsStyle: SxProps<Theme> = {
  px: 3,
  pb: 2,
  gap: 1,
};

export const cancelBtnStyle: SxProps<Theme> = {
  color: "#4F566B",
  borderColor: "#ccc",
  borderRadius: "8px",
  fontWeight: 500,
  fontSize: "14px",
  height: "36px",
  minWidth: "80px",
  textTransform: "none",
  "&:hover": {
    bgcolor: "#f5f5f5",
    borderColor: "#999",
  },
};

export const submitBtnStyle: SxProps<Theme> = {
  backgroundColor: "#c8501b",
  borderRadius: "8px",
  fontWeight: 600,
  fontSize: "14px",
  height: "36px",
  minWidth: "80px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#a63d15",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    color: "#999",
  },
};

export const closeIconButtonStyle: SxProps<Theme> = {
  color: "#4F566B",
  "&:hover": {
    bgcolor: "#f5f5f5",
  },
};