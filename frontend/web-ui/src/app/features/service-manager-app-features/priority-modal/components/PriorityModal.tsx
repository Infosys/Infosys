// PriorityModal component allows users to set the priority (High, Medium, Low) for an application.
// It displays a modal dialog with radio buttons for priority selection and a confirm button to update the priority.
import React, { useState } from "react";
import { Modal, Box, Radio, RadioGroup, FormControlLabel, Typography, Button, CircularProgress, Alert } from "@mui/material";
import { useUpdateApplicationPriorityMutation } from "../../all-applications/api/allApplicationApi";

// Props for the PriorityModal component
interface PriorityModalProps {
  applicationID: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (priority: string) => void;
  defaultValue?: string;
}

// Styles for the modal dialog box
const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 300,
  width: 300,
  bgcolor: "#fff",
  borderRadius: 4,
  boxShadow: 24,
  zIndex: 600,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

// PriorityModal functional component definition
export const PriorityModal: React.FC<PriorityModalProps> = ({
  applicationID,
  open,
  onClose,
  onConfirm,
  defaultValue = "High",
}) => {
  // State to track the selected priority value
  const [priority, setPriority] = useState(defaultValue);

  // RTK Query mutation hook for updating application priority
  const [updatePriority, { isLoading, isSuccess, error }] = useUpdateApplicationPriorityMutation();

  // Handler for confirming the priority selection and updating it via API
  const handleConfirm = async () => {
    try {
      await updatePriority({ id: applicationID, priority }).unwrap();
      console.log(isSuccess);
      console.log(applicationID);
      onConfirm(priority);
      onClose();
    } catch (err) {
      // handle error (show error message if desired)
    }
  };

  // Handler for changing the selected priority value
  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setPriority(value);
  };

  // Render the modal dialog with radio buttons for priority selection and a confirm button
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <RadioGroup
          value={priority}
          onChange={handleChange}
          aria-label="priority"
          sx={{ width: "100%", pt: 1, pb: 2 }}
        >
          {["HIGH", "MEDIUM", "LOW"].map(opt => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio sx={{
                color: "#C84C0E",
                "&.Mui-checked": { color: "#C84C0E" }
              }} />}
              label={
                <Typography sx={{ fontSize: 20, fontWeight: 500, ml: 4 }}>{opt}</Typography>
              }
              sx={{ mb: 2, ml: 4, mr: 4 }}
            />
          ))}
        </RadioGroup>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#C84C0E",
            color: "#fff",
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 18,
            width: "70%",
            mt: 2,
            textTransform: "none",
            "&:hover": { bgcolor: "#A5410C" },
          }}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Confirm"}
        </Button>
        {!!error && (
          <Alert severity="error" sx={{ mt: 2, width: "90%" }}>
            Failed to update priority. Please try again.
          </Alert>
        )}
      </Box>
    </Modal>
  );
};