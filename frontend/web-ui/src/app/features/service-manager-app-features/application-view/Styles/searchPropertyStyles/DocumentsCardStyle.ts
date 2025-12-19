// This file defines style objects for the documents card and its elements in the application view, using Material-UI's sx prop.
// Each exported constant represents a set of styles for a specific UI element related to document display and actions.

import { type SxProps, type Theme } from "@mui/material";

// Styles for the outer container of the documents card
export const documentsCardOuterStyle: SxProps<Theme> = {
  background: "#fff",
  borderRadius: 2,
  boxShadow: "0 1px 12px rgba(247, 243, 243, 0.97)",
  border: "2px solid #ececec",
  p: "0px",
  width: "100%",
  mb: 3,
};

// Styles for the header section of the documents card
export const documentsCardHeaderStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  pb: 2,
  // borderBottom: "1px solid #f3edea",
  px: 2,
};

// Styles for the main title of the documents card
export const documentsTitleStyle: SxProps<Theme> = {
  mt: 1,
  mb: 0.5,
  fontWeight: 550,
  fontSize: 20,
};

// Styles for the subtitle or description under the main title
export const documentsSubtitleStyle: SxProps<Theme> = {
  color: "#585858",
  mt: -1.2,
  fontSize: 11.5,           
  lineHeight: 1.2, 
};

// Styles for the sort/filter label or button
export const documentsSortStyle: SxProps<Theme> = {
  fontWeight: 500,
  color: "#977a47",
  mt: 0.5,
};

// Styles for the list container holding all document rows
export const documentsListStyle: SxProps<Theme> = {
  mt: 1,
  justifyContent: "center",
  padding: 0,
};

// ...existing code...
// Styles for the select dropdown button in the documents card
export const SelectButtonStyle: SxProps<Theme> = {
  borderRadius: "999px",
  height: 36,
  px: 3,
  marginTop: 2,

  // keep select content layout local
  "& .MuiSelect-select": { display: "flex", alignItems: "center", gap: 1 },

  // default outline color (outlined variant)
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#dedede",
  },

  // hover the notched outline
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#c24b4b",
  },

  // when this Select root is focused, change only the notched outline (no root override)
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#d32f2f",
    borderWidth: 1.5,
  },

  // remove native focus outline on inner select element
  "& .MuiSelect-select:focus": {
    outline: "none",
  },
};
// ...existing code...

// Styles for each individual document row in the list
export const EachDocumentRowStyle: SxProps<Theme> = { 
  display: "flex",
  alignItems: "center",
  minWidth: "90%",
  border: "1px solid #000000ff",
  borderRadius: 2,
  // justifyContent: "space-between",
  width: "100%",
  gap: 2,
  padding: "10px",
  }

// Styles for the icon container on the right side of a document row
export const RightIconStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  ml: "auto",            // push to the far right inside the row
  // border: "1px solid #000",
  borderRadius: 1,
  px: 1,
  py: 0.5,
}

// Styles for a document row, with optional last-row logic
export const documentRowStyle = (_isLastRow: boolean): SxProps<Theme> => ({
  position: 'relative',
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: 1.5,
  py: 0.6,
});

// Styles for the icon box displaying the document type or status
export const documentIconBoxStyle: SxProps<Theme> = {

  bgcolor: "#F5F5F5",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: 0,
  ml: 1,
  width: 58,
  height: 58,
  border: "1px solid #e8e8e8",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};


// Styles for the dropdown selector in the documents card
export const DropdownStyle: SxProps<Theme> = {
  // border: "1px solid #000000ff",
  minWidth: 100,
  // borderColor: "#ee1212ff"
};
// Styles for the text box containing document details
export const documentTextBoxStyle: SxProps<Theme> = {
  minWidth: "60%",
};

// Styles for the document title text
export const documentTitleStyle: SxProps<Theme> = {
  fontWeight: 800,
  fontSize: 20,
  color: "#383838",
  lineHeight: 1.3,
};

// Styles for the metadata text (e.g., date, type) under the document title
export const documentMetaStyle: SxProps<Theme> = {
  fontSize: 12,
  color: "#918c8cff",
  fontWeight: 400,
  mt: "2px",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

// Styles for the verified status label (legacy, prefer new styles below)
export const verifiedStyle: SxProps<Theme> = {
  // kept for backwards-compat; prefer the new verified* styles below
  color: "#16a34a",
  fontSize: 12,
  background: "#eaeaeaff",
  borderRadius: "10px",
  px: 1.7,
  py: 0.3,
  fontWeight: 600,
};

// Styles for the container of the verified status
export const verifiedContainerStyle: SxProps<Theme> = {
  // render inside the actions column flow (no absolute positioning)
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  backgroundColor: '#0f7d2eff',
  borderRadius: 5,
  paddingLeft: 1.6,
  paddingTop: 0.4,
  mb: 1.2,
  // removed ml so it doesn't push the Act button
  ml: 0,
  mr: 0,
  alignContent: 'center',
};

// Styles for the container of the rejected status
export const rejectedContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  backgroundColor: '#A30222',
  borderRadius: 5,
  paddingLeft: 1.5,
  paddingTop: 0.4,
  paddingRight: 1.5,
  mb: 1.2,
  // removed ml so it doesn't push the Act button
  ml: 0,
  mr: 0.2,
  alignContent: 'center',
};

// Styles for the container of the pending status
export const PendingContainerStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  backgroundColor: "#A59400",
  borderRadius: 5,
  // match layout with verified/rejected containers
  paddingLeft: 1.2,
  paddingTop: 0.4,
  paddingRight: -1.5,
  mb: 1.2,
  ml: 0,
  mr: 0,
  alignContent: 'center',
};

// Styles for the text of the pending status
export const PendingTextStyle: SxProps<Theme> = {
// same sizing/spacing as verified/rejected text, only color changed for pending
  color: '#ffffffff',
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1,
  mb: 0.5,
  ml: 0,
  paddingLeft: 1,
  paddingRight: 1,
  paddingTop: 0.2,
  paddingBottom: 0.2,
};

// Styles for the text of the rejected status
export const rejectedTextStyle: SxProps<Theme> = {
  color: "#ffffffff",
  fontWeight: 500,
  fontSize: 18,
  lineHeight: 1,
  mb: 0.5,
  mr: 1.0,
  ml: 1,
}

// Styles for the text of the verified status
export const verifiedTextStyle: SxProps<Theme> = {
  color: '#ffffffff',
  fontSize: 18,
  fontWeight: 500,
  lineHeight: 1,
  mb: 0.5,
  ml: 0,
  paddingLeft: 1,
  paddingRight: 1,
  paddingTop: 0.2,
  paddingBottom: 0.2, 
};

// Styles for the icon box of the verified status
export const verifiedIconBoxStyle: SxProps<Theme> = {
  width: 17,
  height: 17,
  borderRadius: '50%',
  border: '2px solid #ffffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffffff',
  mb: 0.5,
  mr: 2,
  mt: 0.2,
};

// Styles for the icon box of the pending status
export const PendingIconBoxStyle: SxProps<Theme> = {
   width: 18,
  height: 18,
  borderRadius: '50%',
  // border: '2px solid #ffffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffffff',
  mb: 0.5,
  mr: 2,
  mt: 0.2,
}

// Styles for the icon box of the cancel/rejected status
export const CancelIconBoxStyle: SxProps<Theme> = {
  color: '#ffffffff' ,
  width: 20,
  height: 20,
  // border: '2px solid #D32F2F',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  mb: 0.5,
  ml: -0.9,
}

// Styles for the actions column on the right side of the document card
export const documentActionsStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 0.8,
  // compact width on the right
  minWidth: 90,
  pr: 1,
  pt: 0.8,
  // make the actions area look like a right-side box inside the card
  border: '1px solid #e6e6e6',
  borderRadius: 6,
  px: 1,
  py: 0.5,
  bgcolor: '#fff',
};

// Styles for the icon button used for document actions (e.g., download, delete)
export const documentIconButtonStyle: SxProps<Theme> = {
  // background: "#f8fafc",
  // border: "1px solid #dedede",
  borderRadius: 6,
  width: 32,
  height: 32,
  p: 0.4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  "&:hover": { bgcolor: "#f1edea" },
  // make the icons visually prominent (orange) to match the screenshot
  color: '#c85a1a',
};