// PropertySummary.tsx
// This component renders a summary of all property form steps before final submission or verification.
// Displays property, IGSR, owner, assessment, and document details, and allows confirmation or editing.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/PropertySummary.css';
import authService from '../../../services/AuthService';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

// Import context
import { usePropertyForm } from '../../../context/PropertyFormContext';
import { useFormMode } from '../../../context/FormModeContext';
import { usePropertySummaryLocalization } from '../../../services/AgentLocalisation/localisation-propertysummary';
// import editIcon from '../../assets/AgentAssets/edit_square.svg';
import editIcon from '../../assets/Agent/edit_square.svg';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
// import rectangle100Icon from '../../assets/Agent/Rectangle_100.svg';
import rectangle100Icon from '../../assets/Agent/Rectangle_100.svg';
import { useLocalization } from '../../../services/AgentLocalisation/formLocalisation';
import type { AlertType } from '../../models/AlertType.model';
import { getUnitOfMeasurementOptions } from '../../../services/jsonServerApiCalls';
import {
  useUpdateApplicationMutation,
  useVerifyApplicationMutation,
} from '../../../redux/apis/applicationApi';
import { NotificationPopup } from '../../components/Popup/NotificationPopup';

/**
 * PropertySummary component
 * Renders a summary of all property form data, allows editing, and handles final confirmation/verification.
 */
export const PropertySummary: React.FC = () => {
  // Context and navigation hooks
  const { mode, setMode } = useFormMode();
  const navigate = useNavigate();
  const { formData, updateForm } = usePropertyForm();

  // Local state for loading and important note
  const [loading, setLoading] = useState(false);
  const [importantNote, setImportantNote] = useState('');

  // RTK Query hooks for updating and verifying application
  const [updateApplication] = useUpdateApplicationMutation();
  const [verifyApplication] = useVerifyApplicationMutation();

  useEffect(() => {
    setImportantNote(formData.importantNotes || '');
  }, [formData.importantNotes]);

  // Localization hook for summary labels and text
  const {
    summaryText,
    propertyInfoVerificationText,
    propertyDetailsText,
    igrsDetailsText,
    ownerInformationText,
    assessmentDetailsText,
    documentsUploadedText,
    propertyTypeText,
    zoneWardText,
    doorNoText,
    plotAreaText,
    locationAddressText,
    coordinatesText,
    surveyNumberText,
    subDivisionText,
    gisReferenceText,
    cadastralMapText,
    igrsRegistrationText,
    ownerNameText,
    mobileNumberText,
    emailText,
    addressText,
    buildingUsageText,
    constructionYearText,
    floorCountText,
    builtupAreaText,
    // annualRentalValueText,
    // propertyTaxZoneText,
    // assessmentStatusText,
    // notesText,
    // sqftText,
    // floorsText,
  } = usePropertySummaryLocalization();

  // General localization hook for button and note text
  const { previousText, saveDraftText, submitButtonText, ImportantNoteText } =
    useLocalization();

  // Helper function to format coordinates for display
  const formatCoordinates = (lat: number, lng: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  };

  // Extract uploaded documents from formData
  const documents =
    formData.documents?.[0]?.files?.map((file, idx) => ({
      id: file.fileStoreId || (idx + 1).toString(),
      name: file.fileName,
      type: file.fileType,
      size: file.fileSize,
      uploadDate: file.dateOfUpload,
      status: 'uploaded',
    })) || [];

  // Extract first owner from formData
  const owner = formData.owners?.[0];

  // Extract property address or use default empty values
  const propertyAddress = formData.propertyAddress || {
    ID: '',
    Locality: '',
    ZoneNo: '',
    WardNo: '',
    BlockNo: '',
    Street: '',
    ElectionWard: '',
    SecretariatWard: '',
    PinCode: 0,
    DifferentCorrespondenceAddress: false,
    PropertyId: '',
    CorrespondenceAddress1: '',
    CorrespondenceAddress2: '',
    CorrespondencePincode: 0,
  };

  // Handler for navigating to previous step
  const onPrevious = () => {
    navigate(-1);
  };

  // Handler for saving draft (not implemented)
  const onSaveDraft = () => {
    // Implement save draft functionality
  };

  // State for notification popup
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

  // Helper to show error notification popup
  function showErrorPopup(message: string, duration = 3000) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: 'warning',
        open: true,
        title: 'Warning!',
        message,
        duration,
      });
    }, 10);
  }

  /**
   * Handles final confirmation/verification of the property application.
   * Updates or verifies the application, sets success messages, and navigates to dashboard.
   */
  const handleConfirm = async () => {
    setLoading(true);
    try {
      setLoading(false);

      updateForm({ importantNotes: importantNote });
      console.log(importantNote);
      
      if (mode !== 'verify') {
        await updateApplication({
          applicationId: localStorage.getItem('applicationId') || '',
          isDraft: false,
          importantNote: importantNote ?? '',
        }).unwrap();
      }

      if (mode === 'verify') {
        await verifyApplication({
          applicationId: localStorage.getItem('applicationId') || '',
          action: 'verify',
          verified: true,
          importantNote: importantNote ?? '',
        }).unwrap();
      }

      localStorage.setItem(
        'successMessage',
        mode === 'verify'
          ? 'Property verified successfully!'
          : mode === 'draft'
          ? 'Property draft submitted!'
          : 'Property created successfully!'
      );

      setMode('none');

      const propertyNo = formData.propertyNo;

      localStorage.setItem('showSuccessPropCreation', 'true');
      localStorage.setItem('propertyNo', propertyNo!);

      localStorage.removeItem('applicationId');
      localStorage.removeItem('propertyId');
      if (authService.isCitizen()) {
        navigate('/citizen');
      } else {
        navigate('/agent');
      }
    } catch (error) {
      setLoading(false);
      showErrorPopup('Operation failed!');
      console.error(error);
    }
  };

  // Fetch unit of measurement from MDMS on mount
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>('');
  useEffect(() => {
    getUnitOfMeasurementOptions()
      .then((data) => {
        setUnitOfMeasurement(data?.unitOfmeasurement || '');
      })
      .catch(() => {
        showErrorPopup('Failed to fetch Unit of Measurement Options');
      });
  }, []);

  // Render the property summary UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />
      <div className="summary-page" style={{ alignContent: 'center' }}>
        <div
          className="step-header-buttons"
          style={{
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
          }}
        >
          <button
            style={{ paddingLeft: '5%', paddingRight: '5%', backgroundColor: 'white' }}
            className="step-header-btn-style"
            onClick={onPrevious}
          >
            <ArrowBackIosNewIcon className="step-header-btn-icon" />
            <span className="step-header-btn-text">{previousText}</span>
          </button>
          <button
            style={{ paddingLeft: '5%', paddingRight: '5%', backgroundColor: 'white' }}
            className="step-header-btn-style"
            onClick={onSaveDraft}
          >
            <SaveOutlinedIcon className="step-header-btn-icon" />
            <span className="step-header-btn-text">{saveDraftText}</span>
          </button>
        </div>

        <div className="summary-header" style={{ marginLeft: '20px' }}>
          <h1>{summaryText}</h1>
          <p className="summary-subtitle">{propertyInfoVerificationText}</p>
        </div>

        <div className="summary-content" style={{ margin: '20px' }}>
          {/* Property Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8' }}>
            <div className="section-header">
              <div className="section-title">{propertyDetailsText}</div>
              <div className="header-buttons">
                <button
                  className="edit-btn"
                  onClick={() => navigate('/property-form/property-information')}
                >
                  <img src={editIcon} alt="Edit" className="edit-icon" />
                </button>
              </div>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">{propertyTypeText}</div>
                <div className="detail-value">{formData.propertyType}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{zoneWardText}</div>
                <div className="detail-value">
                  {formData.propertyAddress?.ZoneNo || ''},{' '}
                  {formData.propertyAddress?.WardNo || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{doorNoText}</div>
                <div className="detail-value">
                  {formData.isgrDetails?.doorNoFrom || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{plotAreaText}</div>
                <div className="detail-value">
                  {formData.assessmentDetails?.ExtentOfSite
                    ? `${formData.assessmentDetails?.ExtentOfSite} Sq.${unitOfMeasurement}`
                    : ''}
                </div>
              </div>

              {/* Location Details */}
              {formData.locationData ? (
                <>
                  <div className="detail-row">
                    <div className="detail-label">{locationAddressText}</div>
                    <div className="detail-value">{formData.locationData.address}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">{coordinatesText}</div>
                    <div className="detail-value">
                      {formatCoordinates(
                        formData.locationData.coordinates?.lat!,
                        formData.locationData.coordinates?.lng!
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* IGSR Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8' }}>
            <div className="section-header">
              <div className="section-title">{igrsDetailsText}</div>
              <button
                className="edit-btn"
                onClick={() => navigate('/property-form/igrs-details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">{surveyNumberText}</div>
                <div className="detail-value">{formData.isgrDetails?.igrsWard || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{subDivisionText}</div>
                <div className="detail-value">
                  {formData.isgrDetails?.igrsBlock || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{gisReferenceText}</div>
                <div className="detail-value">
                  {formData.isgrDetails?.igrsLocality || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{cadastralMapText}</div>
                <div className="detail-value">
                  {formData.isgrDetails?.habitation || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{igrsRegistrationText}</div>
                <div className="detail-value">
                  {formData.isgrDetails?.doorNoFrom || ''}
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Card */}
          <div className="summary-section" style={{ background: '#FBEEE8' }}>
            <div className="section-header">
              <div className="section-title">{ownerInformationText}</div>
              <button
                className="edit-btn"
                onClick={() => navigate('/property-form/owner-details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">{ownerNameText}</div>
                <div className="detail-value">{owner?.Name || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{mobileNumberText}</div>
                <div className="detail-value">{owner?.ContactNo || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{emailText}</div>
                <div className="detail-value">{owner?.Email || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{addressText}</div>
                <div className="detail-value">{propertyAddress.Locality || ''}</div>
              </div>
            </div>
          </div>

          {/* Assessment Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8' }}>
            <div className="section-header">
              <div className="section-title">{assessmentDetailsText}</div>
              <button
                className="edit-btn"
                onClick={() => navigate('/property-form/assessment-details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">{buildingUsageText}</div>
                <div className="detail-value">
                  {formData.assessmentDetails?.ReasonOfCreation || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{constructionYearText}</div>
                <div className="detail-value">
                  {formData.assessmentDetails?.OccupancyCertificateDate || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{floorCountText}</div>
                <div className="detail-value">{formData.floors?.length || ``}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{builtupAreaText}</div>
                <div className="detail-value">
                  {formData.floors?.some((floor) => floor.plinthArea)
                    ? `${formData.floors.reduce(
                        (acc, floor) => acc + (Number(floor.plinthArea) || 0),
                        0
                      )} Sq.${unitOfMeasurement}`
                    : ''}
                </div>
              </div>
              {/* <div className="detail-row">
                <div className="detail-label">{annualRentalValueText}</div>
                <div className="detail-value">₹1,80,000</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{propertyTaxZoneText}</div>
                <div className="detail-value property-tax-zone">Commercial Zone A</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">{assessmentStatusText}</div>
                <div className="detail-value">New Property</div>
              </div>
              <div className="detail-row notes-section">
                <div className="detail-label">{notesText}</div>
                <div className="notes-text">
                  Property verified on site. All measurements confirmed. Electricity and
                  water connections active.
                </div>
              </div> */}
            </div>
          </div>

          {/* Documents */}
          <div className="documents-section">
            <div className="documents-title">{documentsUploadedText}</div>
            <div className="document-icons">
              {documents.map((d) => (
                <div key={d.id} className="document-icon">
                  <div className="doc-icon">
                    {/* {d.type?.toUpperCase() || "PDF"} */}
                    <img src={rectangle100Icon} alt="Document" className="edit-icon" />
                  </div>
                  <div
                    className="doc-label"
                    style={{
                      marginTop: '10px',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                  >
                    {d.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note Section */}
          <div className="important-note-section" style={{ borderRadius: '20px' }}>
            <div className="note-header">
              <label className="note-label" style={{ fontStyle: 'italic' }}>
                {ImportantNoteText}
              </label>
            </div>
            <textarea
              id="note-area"
              className="note-input"
              placeholder=""
              value={importantNote}
              onChange={(e) => setImportantNote(e.target.value)}
              rows={5}
              style={{ border: 'none' }}
            />
            <div className="note-character-count"></div>
          </div>

          {/* ✅ Updated Confirm Section with Camera Button */}
          <div
            className="confirm-section"
            style={{ margin: 'none', justifyContent: 'left' }}
          >
            {/* <button
            className="camera-btn-summary"
            onClick={handleCameraClick}
            title="Take Photo"
            style={{
              width:'80px',
              height:'80px',
              padding:'none',
              margin:'none',
              alignContent:'center',
             
            }}
          >
          <div className='add-image-icon'
          style={{display:'grid', justifyContent:'center', alignContent:'center', justifyItems:'center',}}>
            <img src={cameraIcon}
                 alt="Camera"
                 className="camera-icon"
 
                 />
                 <span>Add <br></br>Photo</span>
            </div>
          </button>
  */}
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
              {mode === 'verify' ? 'Verify' : submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
