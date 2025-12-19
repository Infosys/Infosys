// AddRequestOrComment.tsx
// This page allows an agent to add a request or comment for a property, with file upload support.
// Features:
//   - Comment input and validation
//   - File upload (drag/drop or browse), preview, and removal
//   - Submits comment and files to backend
//   - Uses localization for all labels and messages
//   - Navigation to previous and home screens
// Used in: Agent workflow for property verification and feedback

import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import '../../../styles/AddRequestOrComment.css';
import { uploadFileToFilestore } from '../../../services/AgentLocalisation/fileService';
import type { UploadResult } from '../../../services/AgentLocalisation/fileService';
// import { submitCommentRequest } from '../../../services/addCommentService';
import { useAddCommentLocalization } from '../../../services/AgentLocalisation/localisation-addcomment';
// import { ApplicationApi } from '../../../redux/apis/ApplicationLog/getApplication';
import { usePostApplicationLogMutation } from '../../../redux/apis/applicationApi';

// Update UploadedFile interface
interface UploadedFile {
  name: string;
  url: string;
  filestoreId: string;
  file?: File;
}

export function AddRequestOrComment() {
  // Get propertyId from route params
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store files before upload
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  // RTK Query mutation hook
  const [postApplicationLog ] = usePostApplicationLogMutation();
  const applicationId = localStorage.getItem("applicationId") || "";

  // Use localization hook
  const {
    addCommentTitleText,
    addCommentSubtitleText,
    previousText,
    homeText,
    enterRequestLabelText,
    dragDropText,
    browseSystemText,
    uploadingText,
    downloadText,
    attachDocumentsText,
    cancelText,
    submitText,
    fileUploadFailedText,
    // propertyIdMissingText,
    // pleaseEnterCommentText,
    // failedToSubmitText
  } = useAddCommentLocalization();

  // Store file data in state on select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          url: URL.createObjectURL(file),
          filestoreId: "",
          file,
        },
      ]);
      e.target.value = "";
    }
  };

  // Store file data in state on drag-drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFiles([
        ...uploadedFiles,
        {
          name: file.name,
          url: URL.createObjectURL(file),
          filestoreId: "",
          file,
        },
      ]);
    }
  };
  const userName = localStorage.getItem("agentUsername")|| "";
  const actor = localStorage.getItem("agentRole")|| "AGENT";

  // Remove file from state
  const handleRemoveFile = (idx: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload files to filestore on submit
  const handleSubmit = async () => {
  setError(null);
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
      metadata: {},
      performedDate: new Date().toISOString(),
      action: "CREATE",
      actor: actor
    };

    if (uploadedFileResults.length > 0 && uploadedFileResults[0].filestoreId) {
      payload.fileStoreId = uploadedFileResults[0].filestoreId;
    }
    console.log("Payload for put :", payload);
    
    // Now send payload
    await postApplicationLog(payload).unwrap();

      // Clear states after successful submit
    setComment("");
    setUploadedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setUploading(false);
    // Optionally navigate or show success
  } catch (err) {
    setError(fileUploadFailedText);
    setUploading(false);
  }
};

  const handlePrevious = () => {
    if (propertyId) {
      navigate(`/verification/${propertyId}`);
    } else {
      navigate(-1);
    }
  };

  // Navigate to home screen
  const handleHome = () => {
    navigate('/agent');
  };


 
  // Render AddRequestOrComment page UI
  return (
    <div className="commentreq-container">
      {/* Header Section */}
      <div className="commentreq-header">
        <div className="commentreq-title">{addCommentTitleText}</div>
        <div className="commentreq-subtitle">{addCommentSubtitleText}</div>
      </div>
      {/* Navigation Section */}
      <div className="commentreq-nav-row">
        <div className="commentreq-nav-btn-col">
          <button className="commentreq-nav-btn" onClick={handlePrevious}>
            <ArrowBackIosNewIcon style={{ color: '#C8504B', fontSize: 32 }} />
          </button>
          <div className="commentreq-nav-label">{previousText}</div>
        </div>
        <div className="commentreq-nav-btn-col">
          <button className="commentreq-nav-btn" onClick={handleHome}>
            <HomeOutlinedIcon style={{ color: '#C8504B', fontSize: 32 }} />
          </button>
          <div className="commentreq-nav-label">{homeText}</div>
        </div>
      </div>

      {/* Form Section */}
      <div className="commentreq-form">
        <label className="commentreq-label" htmlFor="comment">
          {enterRequestLabelText}
        </label>
        <textarea
          className="commentreq-textarea"
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* File Upload */}
        <div
          className={`commentreq-uploadbox${uploading ? ' uploading' : ''}`}
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            opacity: uploading ? 0.6 : 1,
            pointerEvents: uploading ? 'none' : 'auto',
          }}
        >
          <div className="uploadbox-arrow">&#8679;</div>
          <div className="uploadbox-text">
            {dragDropText}{' '}
            <span
              className="uploadbox-browse"
              onClick={(e) => {
                e.stopPropagation();
                if (!uploading) fileInputRef.current?.click();
              }}
            >
              {browseSystemText}
            </span>
          </div>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            disabled={uploading}
          />
        </div>
        {uploading && (
          <div style={{ color: '#C8504B', fontSize: '13px', marginTop: '6px' }}>
            {uploadingText}
          </div>
        )}

        {/* Uploaded file previews */}
        {uploadedFiles.map((file, idx) => (
          <div className="commentreq-filebox" key={file.filestoreId}>
            <div className="filebox-row">
              <PictureAsPdfIcon style={{ color: '#C8504B', fontSize: 32 }} />
              <div className="filebox-name">{file.name}</div>
              <button className="filebox-remove" onClick={() => handleRemoveFile(idx)}>
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <button
              className="filebox-download"
              onClick={() => window.open(file.url, '_blank')}
            >
              <DownloadIcon fontSize="small" style={{ marginRight: 5 }} /> {downloadText}
            </button>
          </div>
        ))}

        <div className="commentreq-attachnote">{attachDocumentsText}</div>
        {error && <div style={{ color: '#C8504B', marginTop: '10px' }}>{error}</div>}
      </div>

      {/* Actions */}
      <div className="commentreq-actions">
        <button className="commentreq-btn cancel" onClick={() => navigate(-1)}>
          {cancelText}
        </button>
        <button
          className="commentreq-btn submit"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {submitText}
        </button>
      </div>
    </div>
  );
}
