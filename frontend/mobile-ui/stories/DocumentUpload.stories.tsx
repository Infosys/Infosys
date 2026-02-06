import React, { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import '../src/styles/DocumentUpload.css';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';

const meta: Meta = {
  title: 'Agent/Documents',
};

export default meta;
type Story = StoryObj<typeof MockDocumentUpload>;

function MockDocumentUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState([
    {
      id: '1',
      name: 'ownership_deed.pdf',
      size: '120 KB',
      date: new Date().toLocaleDateString(),
      documentType: 'Registered Document',
      status: 'uploaded',
    },
  ]);

  const pendingDocuments = [
    'Two Non-Judicial Stamp Papers',
    'Notarized Affidavit',
    'Death Certificate',
    'Third Party Verification',
    'Patta Certificate',
  ];

  const handleChooseFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newDoc = {
      id: String(Date.now()),
      name: file.name,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      date: new Date().toLocaleDateString(),
      documentType: 'Photo of Property',
      status: 'uploaded',
    };
    setUploadedDocs((s) => [newDoc, ...s]);
  };

  const handleView = (d: any) => alert(`View: ${d.name}`);
  const handleDownload = (d: any) => alert(`Download: ${d.name}`);
  const handleRemove = (id: string) => setUploadedDocs((s) => s.filter((d) => d.id !== id));

  return (
    <div className="property-form-container" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelected} />

      <div className="form-content">
        <div className="upload-status">
          <span className="upload-count">{uploadedDocs.length}/12 Documents Uploaded</span>
        </div>

        <div className="uploaded-section">
          {uploadedDocs.map((doc: any) => (
            <div key={doc.id} className="document-group">
              <h3 className="document-group-title">{doc.documentType}</h3>
              <div className="upload-status-indicator">
                <span className="status-icon"><TaskAltOutlinedIcon style={{ color: '#1BB96D', fontSize: 18 }} /></span>
                <span className="status-text">Uploaded successfully</span>
              </div>

              <div className="document-item uploaded">
                <div className="document-uploaded-icon">
                  <TaskAltOutlinedIcon style={{ fontSize: 38 }} />
                </div>
                <div className="imageName-metadata" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="doc-metadata">
                    <div className="uploaded-file-name">{doc.name}</div>
                    <div className="document-meta">{doc.size} • {doc.date}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button className="action-btn view-btn" onClick={() => handleView(doc)} title="View">
                      <VisibilityOutlinedIcon style={{ color: '#C84C0E', fontSize: 30 }} />
                    </button>
                    <button className="action-btn download-btn" onClick={() => handleDownload(doc)} title="Download">
                      <DownloadOutlinedIcon style={{ color: '#C84C0E', fontSize: 30 }} />
                    </button>
                    <button className="action-btn remove-btn" onClick={() => handleRemove(doc.id)} title="Remove">
                      <CloseRoundedIcon style={{ color: '#313131', fontSize: 20 }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pending-section">
          {pendingDocuments.map((docType, i) => (
            <div key={i} className="document-item pending">
              <div className="document-details">
                <div className="document-name">{docType}</div>
              </div>
              <div className="upload-actions">
                <div className="choose-file-section">
                  <button className="choose-file-btn" onClick={handleChooseFile}>Choose File</button>
                  <div className="file-types">PDF, JPG, PNG</div>
                </div>
                <button className="camera-btn" onClick={handleChooseFile}><AddAPhotoOutlinedIcon /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button className="confirm-btn" onClick={() => alert('Confirm clicked')}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <MockDocumentUpload />
    </div>
  ),
};
