import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, FormControl, Select, MenuItem, Box } from "@mui/material";
import React, { useState } from "react";
import { channelOptions } from "../../Utils/NotifyCardsUtil";
import NotifyCard from "../Cards/NotifyCard";

interface CreateTemplateDialogProps {
  open: boolean;
  onClose: () => void;
}

const templateTypes = [
  "Utility",
  "General",
  "Alert",
  "Reminder",
];

const inputSx = {
  height: 40,
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
};

const selectSx = {
  height: 40,
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    height: 40,
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
};

const multilineInputSx = {
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#000",
    },
    "&:hover fieldset": {
      borderColor: "#000",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#000",
    },
  },
};

const cancelBtnSx = {
  color: "#c84c03",
  borderColor: "#c84c03",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  borderWidth: 1,
  borderStyle: "solid",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#f5f5f5",
    borderColor: "#c84c03",
  },
};

const createBtnSx = {
  backgroundColor: "#c84c03",
  color: "#fff",
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "#a63d02",
  },
};

const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({ open, onClose }) => {
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [messageContent, setMessageContent] = useState("");

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography fontSize={20} fontWeight={600}>Create Notification Template</Typography>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography fontWeight={300} fontSize={16} mb={1}>Template Name</Typography>
          <TextField
            placeholder="e.g. Tax Payment Reminder"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            variant="outlined"
            sx={inputSx}
          />
        </Box>
        <Box mb={2}>
          <Typography fontWeight={300} fontSize={16} mb={1}>Template Type</Typography>
          <FormControl fullWidth sx={selectSx}>
            <Select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value as string)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Type</MenuItem>
              {templateTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mb={3}>
          {channelOptions.map((option) => (
            <NotifyCard key={option.label} label={option.label} icon={option.icon} />
          ))}
        </Box>
        <Box mb={2}>
          <Typography fontWeight={300} fontSize={16} mb={1}>Message Content</Typography>
          <TextField
            placeholder="Enter message"
            fullWidth
            multiline
            minRows={3}
            maxRows={6}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            variant="outlined"
            sx={multilineInputSx}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{mr:4}}>
        <Button onClick={onClose} variant="outlined" sx={cancelBtnSx}>Cancel</Button>
        <Button onClick={onClose} variant="contained" sx={createBtnSx}>Create Template</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTemplateDialog;