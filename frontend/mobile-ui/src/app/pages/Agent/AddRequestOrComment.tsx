// AddRequestOrComment.tsx
// This page allows an agent to add a request or comment for a property, with file upload support.
// Features:
//   - Comment input and validation
//   - File upload (drag/drop or browse), preview, and removal
//   - Submits comment and files to backend
//   - Uses localization for all labels and messages
//   - Navigation to previous and home screens
// Used in: Agent workflow for property verification and feedback

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { uploadFileToFilestore } from "../../../services/AgentLocalisation/fileService";
import type { UploadResult } from "../../../services/AgentLocalisation/fileService";
import { useAddCommentLocalization } from "../../../services/AgentLocalisation/localisation-addcomment";
import { usePostApplicationLogMutation } from "../../../redux/apis/applicationApi";
import { Box, Button, TextField, Typography } from "@mui/material";
import FileUploadBox from "../../features/Agent/components/FileUploadBox";
import UploadedFilePreview from "../../features/Agent/components/UploadedFilePreview";

import {
  pageContainerSx,
  headerBoxSx,
  titleSx,
  subtitleSx,
  navButtonsBoxSx,
  navButtonSx,
  navButtonTextSx,
  formSectionSx,
  textFieldSx,
  fileUploadBoxSectionSx,
  attachDocumentsTextSx,
  actionButtonsBoxSx,
  cancelButtonSx,
  submitButtonSx,
} from "./styles/AddRequestOrCommentStyle";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";

// Update UploadedFile interface
interface UploadedFile {
  name: string;
  url: string;
  filestoreId: string;
  file?: File;
}

export function AddRequestOrComment() {
  // Get propertyId from route params
  // const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store files before upload
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  // RTK Query mutation hook
  const [postApplicationLog] = usePostApplicationLogMutation();
  const applicationId = localStorage.getItem("applicationId") || "";
  const [popupOpen, setPopupOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // Use localization hook
  const {
    addCommentTitleText,
    addCommentSubtitleText,
    previousText,
    homeText,
    enterRequestLabelText,
    attachDocumentsText,
    cancelText,
    submitText,
  } = useAddCommentLocalization();

  const showNotification = (
    setPopupOpen: (open: boolean) => void,
    setSuccess: (success: boolean) => void,
    setError: (error: string | null) => void,
    isSuccess: boolean,
    message: string
  ) => {
    setPopupOpen(false);
    requestAnimationFrame(() => {
      setSuccess(isSuccess);
      if (isSuccess) {
        setSuccessMessage(message); 
        setError(null);
      } else {
        setError(message);
        setSuccessMessage("");
      }
      setPopupOpen(true);
    });
  };

  const ALLOWED_TYPES = new Set([
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ]);
  const MAX_SIZE_MB = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!ALLOWED_TYPES.has(file.type)) {
        setPopupOpen(false);
        setTimeout(() => {
          setSuccess(false);
          setError("Only PDF, PNG, JPG, or JPEG files are allowed.");
          setPopupOpen(true);
        }, 10);
        e.target.value = "";
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showNotification(
          setPopupOpen,
          setSuccess,
          setError,
          false,
          "Maximum file size is 5 MB."
        );
        e.target.value = "";
        return;
      }

      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          url: URL.createObjectURL(file),
          filestoreId: "",
          file,
        },
      ]);
      setError(null);
      e.target.value = "";
    }
  };

  const userName = localStorage.getItem("agentUsername") || "";
  const actor = localStorage.getItem("agentRole") || "AGENT";

  // Remove file from state
  const handleRemoveFile = (idx: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload files to filestore on submit
  const handleSubmit = async () => {
    if (!comment.trim()) {
      showNotification(
        setPopupOpen,
        setSuccess,
        setError,
        false,
        "Cooment cant be empty!"
      );
      return;
    }

    setUploading(true);

    try {
      // Upload each file and get filestoreId
      const uploadedFileResults = await Promise.all(
        uploadedFiles.map(async (f) => {
          if (f.file && !f.filestoreId) {
            const result: UploadResult = await uploadFileToFilestore(f.file);
            return {
              ...f,
              filestoreId: result.files[0].fileStoreId,
            };
          }
          return f;
        })
      );
      setUploadedFiles(uploadedFileResults);

      // Now call postApplicationLog with filestoreIds
      const payload: any = {
        applicationId: applicationId,
        comments: comment,
        performedBy: userName,
        metadata:
          uploadedFileResults.length > 0
            ? { file: { name: uploadedFileResults[0].name } }
            : {},
        performedDate: new Date().toISOString(),
        action: "CREATE",
        actor: actor,
      };

      if (
        uploadedFileResults.length > 0 &&
        uploadedFileResults[0].filestoreId
      ) {
        payload.fileStoreId = uploadedFileResults[0].filestoreId;
      }

      // Now send payload
      const response = await postApplicationLog(payload).unwrap();

      // Show success popup if API returns success
      if (response?.success) {
        setPopupOpen(false);
        showNotification(
          setPopupOpen,
          setSuccess,
          setError,
          true,
          "Successfully added comment."
        );

        // Clear states after successful submit
        setComment("");
        setUploadedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setPopupOpen(false);
        setTimeout(() => {
          setSuccess(false);
          setError("Could not add comment. Please try again.");
          setPopupOpen(true);
        }, 10);
      }
    } catch (err) {
      console.log(err);
      showNotification(
        setPopupOpen,
        setSuccess,
        setError,
        false,
        "Only PDF, PNG, JPG, or JPEG files are allowed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handlePrevious = () => {
    setComment("");
    setUploadedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    navigate(-1);
  };

  // Navigate to home screen
  const handleHome = () => {
    navigate("/agent");
  };

  // Render AddRequestOrComment page UI
  return (
    <>
      <NotificationPopup
        type={success ? "success" : "warning"}
        title={success ? "Success" : "Upload Error"}
        message={success ? successMessage : error || ""}
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          if (success) {
            setSuccess(false);
            setSuccessMessage("");
          } else {
            setError(null);
          }
        }}
      />

      <Box sx={pageContainerSx}>
        {/* Header component */}
        <Box sx={headerBoxSx}>
          <Typography sx={titleSx}>{addCommentTitleText}</Typography>
          <Typography sx={{ ...subtitleSx }}>
            {addCommentSubtitleText}
            {/* add document leave a comment/request for application log */}
          </Typography>

          {/*  Navigation Buttons  */}
          <Box sx={navButtonsBoxSx}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIosNewIcon />}
              sx={navButtonSx}
              onClick={handlePrevious}
            >
              <Typography sx={navButtonTextSx}>{previousText}</Typography>
            </Button>

            <Button
              variant="contained"
              startIcon={<HomeOutlinedIcon />}
              sx={navButtonSx}
              onClick={handleHome}
            >
              <Typography sx={navButtonTextSx}>{homeText}</Typography>
            </Button>
          </Box>
        </Box>

        {/* Form Section */}
        <Box sx={formSectionSx}>
          <Box>
            <Typography>{enterRequestLabelText}</Typography>
            <TextField
              sx={textFieldSx}
              multiline
              rows={1}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={uploading}
            />
          </Box>

          <Box sx={fileUploadBoxSectionSx}>
            <FileUploadBox onFileChange={handleFileChange} />
            <Typography sx={attachDocumentsTextSx}>
              {attachDocumentsText}
            </Typography>
          </Box>

          {/* Uploaded file previews */}
          {uploadedFiles.map((file, idx) => (
            <UploadedFilePreview
              key={file.filestoreId || file.name}
              name={file.name}
              onRemove={() => handleRemoveFile(idx)}
              onDownload={() => window.open(file.url, "_blank")}
            />
          ))}

          <Box sx={actionButtonsBoxSx}>
            <Button
              variant="outlined"
              sx={cancelButtonSx}
              onClick={handlePrevious}
              disabled={uploading}
            >
              <Typography sx={navButtonTextSx}>{cancelText}</Typography>
            </Button>

            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={submitButtonSx}
              disabled={uploading}
            >
              {uploading ? "Submitting..." : submitText}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
