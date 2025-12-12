import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/DocumentUpload.css';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertyForm } from '../../../context/PropertyFormContext';
import {
  uploadFileToFilestore,
  getFileFromFilestore,
} from '../../../services/AgentLocalisation/fileService';
import { useDocumentUploadLocalization } from '../../../services/AgentLocalisation/localisation-documentupload';
import {
  useCreateDocumentUploadDetailsMutation,
  useGetDocumentsUploadDetailsByPropertyIdQuery,
  useDeleteDocumentUploadDetailsMutation,
} from '../../features/PropertyForm/api/documentUpload.api';

import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import StepHeader from '../../features/Agent/components/StepHeader';
import type { AlertType } from '../../models/AlertType.model';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

// Type for uploaded document state
interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  date: string;
  status: 'uploaded' | 'pending';
  fileStoreId?: string;
  fileType?: string;
  documentType: string;
  isNewlyAdded?: boolean;
}

// Error type for API errors
interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

// Main component for document upload step in property form
export const DocumentUpload: React.FC = () => {
  const { mode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();

  // Property ID from form data
  const PROPERTY_ID = formData.id ?? '';

  // Fetch existing uploaded documents for this property
  const {
    data: existingDocuments,
    isLoading: isFetchingDocuments,
    error: fetchError,
  } = useGetDocumentsUploadDetailsByPropertyIdQuery(PROPERTY_ID, {
    skip: mode !== 'draft' && mode !== 'verify',
  });

  const {
    propertyFormText,
    newPropertyFormText,
    documentUploadText,
    documentsUploadedText,
    uploadedSuccessfullyText,
    fileTypesText,
    chooseFileText,
    takePhotoText,
    // verifyText,
    confirmText,
    twoNonJudicialStampPapersText,
    notarizedAffidavitText,
    deathCertificateText,
    thirdPartyVerificationText,
    pattaCertificateText,
    mroProceedingsText,
    willDeedText,
    decreeDocumentText,
    registeredDocumentText,
    photoOfPropertyText,
    // draftSavedText,
    fileUploadFailedText,
    fileNotFoundText,
    downloadFailedText,
    unableToOpenFileText,
    previousText,
    saveDraftText,
  } = useDocumentUploadLocalization();

  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: 'warning',
    open: false,
    title: '',
    message: '',
    duration: 3000,
  });

  // State for uploaded documents
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);

  function showErrorPopup(
    message: string,
    duration = 3000,
    type: AlertType = 'warning',
    title: string = 'Warning'
  ) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type,
        open: true,
        title,
        message,
        duration,
      });
    }, 10);
  }

  // Populate uploadedDocs from API or form data on mount/update
  useEffect(() => {
    if (
      existingDocuments?.data &&
      Array.isArray(existingDocuments.data) &&
      existingDocuments.data.length > 0
    ) {
      const mappedDocs: UploadedDocument[] = existingDocuments.data.map((doc) => ({
        id: doc.ID,
        name: doc.DocumentName,
        size: doc.size || 'N/A',
        date: new Date(doc.UploadDate).toLocaleDateString(),
        status: 'uploaded' as const,
        fileStoreId: doc.FileStoreID,
        fileType: doc.DocumentName.endsWith('.pdf')
          ? 'application/pdf'
          : doc.DocumentName.endsWith('.png')
          ? 'image/png'
          : doc.DocumentName.endsWith('.jpg') || doc.DocumentName.endsWith('.jpeg')
          ? 'image/jpeg'
          : '',
        documentType: doc.DocumentType,
        isNewlyAdded: false,
      }));
      setUploadedDocs(mappedDocs);
    } else if (formData.documents?.[0]?.files) {
      const mappedDocs = formData.documents[0].files.map((file, idx) => ({
        id: file.fileStoreId || (idx + 1).toString(),
        name: file.fileName,
        size: `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB`,
        date: file.dateOfUpload,
        status: 'uploaded' as const,
        fileStoreId: file.fileStoreId,
        fileType: file.fileType,
        documentType: file.documentType || '',
        isNewlyAdded: false,
      }));
      setUploadedDocs(mappedDocs);
    }
  }, [existingDocuments, formData.documents]);

  // State for current upload type, error, and file input ref
  const [currentUploadType, setCurrentUploadType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // RTK mutations for uploading and deleting documents
  const [createDocumentUpload, { isLoading: isSubmitting }] =
    useCreateDocumentUploadDetailsMutation();
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentUploadDetailsMutation();

  // Show loading state while fetching documents
  if (isFetchingDocuments) {
    return (
      <div className="property-form-container">
        <div className="form-content" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  // Log fetch error if present
  if (fetchError) {
    console.error('Error fetching documents:', fetchError);
  }

  // Navigate back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Save current document state as draft in form
  const handleSaveDraft = () => {
    updateForm({
      documents: [
        {
          ...(formData.documents?.[0] || {}),
          documentType: formData.documents?.[0]?.documentType || '',
          serialNoLabel: formData.documents?.[0]?.serialNoLabel || '',
          revenueDocumentNumber: formData.documents?.[0]?.revenueDocumentNumber || '',
          files: uploadedDocs.map((doc) => ({
            fileStoreId: doc.fileStoreId || doc.id,
            fileName: doc.name,
            fileSize:
              Number(doc.size.replace(' MB', '').replace('N/A', '0')) * 1024 * 1024,
            dateOfUpload: doc.date,
            fileType:
              doc.fileType ||
              (doc.name.endsWith('.pdf')
                ? 'application/pdf'
                : doc.name.endsWith('.png')
                ? 'image/png'
                : doc.name.endsWith('.jpg')
                ? 'image/jpeg'
                : ''),
            documentType: doc.documentType,
          })),
        },
      ],
    });
  };

  // Trigger file input for choosing a file
  const handleChooseFile = (documentType: string) => {
    setCurrentUploadType(documentType);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  // Trigger file input for taking a photo
  const handleTakePhoto = (documentType: string) => {
    setCurrentUploadType(documentType);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  // Handle file selection and upload to filestore
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUploadType) return;

    // Add file type validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      showErrorPopup('Invalid file type. Only PDF, JPG, and PNG files are allowed.');
      setCurrentUploadType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const result = await uploadFileToFilestore(file);

      // Convert file size
      const fileSizeInKB = file.size / 1024;
      const formattedSize =
        fileSizeInKB >= 1024
          ? `${(fileSizeInKB / 1024).toFixed(2)} MB`
          : `${fileSizeInKB.toFixed(2)} KB`;

      const uploadedDoc: UploadedDocument = {
        id: result.files[0].fileStoreId,
        name: file.name,
        size: formattedSize,
        date: new Date().toLocaleDateString(),
        status: 'uploaded',
        fileStoreId: result.files[0].fileStoreId,
        fileType: file.type,
        documentType: currentUploadType,
        isNewlyAdded: true,
      };

      setUploadedDocs((prev) => [...prev, uploadedDoc]);
      setCurrentUploadType(null);
    } catch (err) {
      console.error('Error uploading file:', err);
      showErrorPopup(fileUploadFailedText);
      setCurrentUploadType(null);
    }
  };

  // Download a document from filestore
  const handleDownloadDocument = async (docId: string) => {
    const doc = uploadedDocs.find((d) => d.id === docId);
    if (!doc || !doc.fileStoreId) {
      showErrorPopup(fileNotFoundText);
      return;
    }
    try {
      const blob = await getFileFromFilestore(doc.fileStoreId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error downloading document:', err);
      showErrorPopup(downloadFailedText);
    }
  };

  // View a document in a new tab
  const handleViewDocument = async (docId: string) => {
    const doc = uploadedDocs.find((d) => d.id === docId);
    if (!doc || !doc.fileStoreId) {
      showErrorPopup(fileNotFoundText);
      return;
    }
    try {
      const blob = await getFileFromFilestore(doc.fileStoreId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error viewing document:', err);
      showErrorPopup(unableToOpenFileText);
    }
  };

  // Remove a document (delete from server if not newly added)
  const handleRemoveDocument = async (docId: string) => {
    const doc = uploadedDocs.find((d) => d.id === docId);

    if (doc?.isNewlyAdded) {
      setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
      return;
    }

    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(docId).unwrap();
      setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      const error = err as ApiError;
      console.error('Failed to delete document:', err);
      showErrorPopup(error?.data?.message || 'Failed to delete document. Please try again.');
    }
  };

  // Confirm and submit all uploaded documents
  const handleConfirm = async () => {
    setError(null);

    const newlyAddedDocs = uploadedDocs.filter((doc) => doc.isNewlyAdded === true);

    if (newlyAddedDocs.length === 0) {
      updateForm({
        documents: [
          {
            documentType: formData.documents?.[0]?.documentType || '',
            serialNoLabel: formData.documents?.[0]?.serialNoLabel || '',
            revenueDocumentNumber: formData.documents?.[0]?.revenueDocumentNumber || '',
            files: uploadedDocs.map((doc) => ({
              fileStoreId: doc.fileStoreId || doc.id,
              fileName: doc.name,
              fileSize:
                Number(doc.size.replace(' MB', '').replace('N/A', '0')) * 1024 * 1024,
              dateOfUpload: doc.date,
              fileType:
                doc.fileType ||
                (doc.name.endsWith('.pdf')
                  ? 'application/pdf'
                  : doc.name.endsWith('.png')
                  ? 'image/png'
                  : doc.name.endsWith('.jpg')
                  ? 'image/jpeg'
                  : ''),
              documentType: doc.documentType,
            })),
          },
        ],
      });

      navigate('/property-form/summary');
      return;
    }

    const documentPayload = newlyAddedDocs.map((doc) => ({
      PropertyId: PROPERTY_ID,
      DocumentType: doc.documentType,
      DocumentName: doc.name,
      FileStoreID: doc.fileStoreId || '',
      Size: doc.size,
      UploadDate: new Date().toISOString(),
    }));

    try {
      const response = await createDocumentUpload(documentPayload).unwrap();
      console.log('Documents created successfully:', response);

      updateForm({
        documents: [
          {
            documentType: formData.documents?.[0]?.documentType || '',
            serialNoLabel: formData.documents?.[0]?.serialNoLabel || '',
            revenueDocumentNumber: formData.documents?.[0]?.revenueDocumentNumber || '',
            files: uploadedDocs.map((doc) => ({
              fileStoreId: doc.fileStoreId || doc.id,
              fileName: doc.name,
              fileSize:
                Number(doc.size.replace(' MB', '').replace('N/A', '0')) * 1024 * 1024,
              dateOfUpload: doc.date,
              fileType:
                doc.fileType ||
                (doc.name.endsWith('.pdf')
                  ? 'application/pdf'
                  : doc.name.endsWith('.png')
                  ? 'image/png'
                  : doc.name.endsWith('.jpg')
                  ? 'image/jpeg'
                  : ''),
              documentType: doc.documentType,
            })),
          },
        ],
      });

      navigate('/property-form/summary');
    } catch (err) {
      const error = err as ApiError;
      console.error('Failed to save documents:', err);
      setError(error?.data?.message || 'Failed to save documents. Please try again.');
    }
  };

  // List of required/pending document types
  const pendingDocuments = [
    twoNonJudicialStampPapersText,
    notarizedAffidavitText,
    deathCertificateText,
    thirdPartyVerificationText,
    pattaCertificateText,
    mroProceedingsText,
    willDeedText,
    decreeDocumentText,
    registeredDocumentText,
    photoOfPropertyText,
  ];

  // Limit for max uploads and list of uploaded document types
  const canUploadMore = uploadedDocs.length < 12;
  const uploadedDocTypes = uploadedDocs.map((d) => d.documentType);

  // Main render: upload controls, uploaded docs, pending docs, and confirm button
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      
      <div className="property-form-container">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".pdf,.jpg,.png"
          onChange={handleFileSelected}
        />

        <StepHeader
          title={`${mode === 'new' ? `${newPropertyFormText}` : `${propertyFormText}`}`}
          subtitle={`${documentUploadText}`}
          steps={10}
          activeStep={9}
          onPrevious={() => handleBack()}
          onSaveDraft={() => handleSaveDraft()}
          saveDraftText={saveDraftText}
          previousText={previousText}
        />

        <div className="form-content">
          <div className="upload-status">
            <span className="upload-count">
              {uploadedDocs.length}/12 {documentsUploadedText}
            </span>
          </div>
          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: 10 }}>
              {error}
            </div>
          )}

          <div className="uploaded-section">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="document-group">
                <h3 className="document-group-title">{doc.documentType}</h3>
                <div className="upload-status-indicator">
                  <span className="status-icon">
                    <TaskAltOutlinedIcon style={{ color: '#1BB96D', fontSize: 18 }} />
                  </span>
                  <span className="status-text">{uploadedSuccessfullyText}</span>
                </div>

                <div className="document-item uploaded" style={{ display: 'grid' }}>
                  <div
                    className="document-uploaded-icon"
                    style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}
                  >
                    <TaskOutlinedIcon
                      style={{
                        color: '#000000ff',
                        fontSize: 38,
                        fontWeight: 200,
                        backgroundColor: 'white',
                        marginTop: '6',
                        marginRight: '6',
                        borderRadius: '8px',
                      }}
                    />

                    <div
                      className="imageName-metadata"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '20px',
                        height: '20px',
                      }}
                    >
                      <div className="doc-metadata">
                        <div className="uploaded-file-name" style={{ width: '150px' }}>
                          {doc.name}
                        </div>
                        <div className="document-meta">
                          {doc.size} &bull; {doc.date}
                        </div>
                      </div>

                      <div className="doc-remove-btn">
                        <button
                          className="action-btn remove-btn"
                          onClick={() => handleRemoveDocument(doc.id)}
                          type="button"
                          disabled={isDeleting}
                          style={{ alignItems: 'end', width: '90px', height: '20px' }}
                        >
                          <CloseRoundedIcon
                            style={{
                              color: '#313131ff',
                              fontSize: 20,
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              opacity: isDeleting ? 0.5 : 1,
                            }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className="document-actions"
                    style={{
                      marginTop: '0px',
                      width: '40px',
                      height: '20px',
                      alignItems: 'center',
                      marginLeft: '200px',
                    }}
                  >
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleViewDocument(doc.id)}
                      type="button"
                      style={{ alignItems: 'end' }}
                    >
                      <VisibilityOutlinedIcon
                        style={{ color: '#C84C0E', fontSize: 30 }}
                      />
                    </button>
                    <button
                      className="action-btn download-btn"
                      onClick={() => handleDownloadDocument(doc.id)}
                      type="button"
                    >
                      <DownloadOutlinedIcon style={{ color: '#C84C0E', fontSize: 30 }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pending-section">
            {pendingDocuments.map(
              (docType, index) =>
                !uploadedDocTypes.includes(docType) && (
                  <div key={index} className="document-item pending">
                    <div className="document-details">
                      <div className="document-name">{docType}</div>
                    </div>
                    <div className="upload-actions">
                      <div className="choose-file-section">
                        <button
                          className="choose-file-btn"
                          onClick={() =>
                            canUploadMore && handleChooseFile(docType.replace('*', ''))
                          }
                          disabled={!canUploadMore}
                          type="button"
                        >
                          {chooseFileText}
                        </button>
                        <div className="file-types">{fileTypesText}</div>
                      </div>
                      <button
                        className="camera-btn"
                        onClick={() =>
                          canUploadMore && handleTakePhoto(docType.replace('*', ''))
                        }
                        disabled={!canUploadMore}
                        type="button"
                        title={takePhotoText}
                      >
                        <AddAPhotoOutlinedIcon style={{ fontWeight: 30, fontSize: 20 }} />
                      </button>
                    </div>
                  </div>
                )
            )}
          </div>

          <div className="form-actions">
            <button
              style={{ marginLeft: '52%', padding: '2.5%', fontSize: '16px' }}
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : mode === 'verify'
                ? 'Verify'
                : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
