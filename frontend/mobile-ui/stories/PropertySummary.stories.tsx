import React, { useState} from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

// Import the original CSS file directly
import '../src/styles/PropertySummary.css';

// Import icons using the same approach as the original component
import editIcon from '../src/app/assets/Agent/edit_square.svg';
import rectangle100Icon from '../src/app/assets/Agent/Rectangle_100.svg';

// Mock data for property summary
const mockPropertyData = {
  propertyType: 'Residential',
  propertyNo: 'PT001',
  propertyAddress: {
    ZoneNo: 'Zone 3',
    WardNo: 'Ward 12',
    Locality: 'MG Road',
    ID: '',
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
  },
  isgrDetails: {
    doorNoFrom: '12/A',
    igrsWard: 'IGRS Ward 5',
    igrsBlock: 'Block B',
    igrsLocality: 'Locality X',
    habitation: 'Habitation Y',
  },
  assessmentDetails: {
    ExtentOfSite: '450',
    ReasonOfCreation: 'Owner Occupied',
    OccupancyCertificateDate: '2018',
  },
  locationData: {
    address: '12, MG Road, City',
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  owners: [{
    Name: 'Anita Sharma',
    ContactNo: '9876543210',
    Email: 'anita@example.com',
  }],
  floors: [
    { plinthArea: '1200' },
    { plinthArea: '1100' },
    { plinthArea: '1000' },
  ],
  documents: [{
    files: [
      { 
        fileStoreId: '1',
        fileName: 'Property_Document.pdf',
        fileType: 'pdf',
        fileSize: '2MB',
        dateOfUpload: '2024-01-15'
      }
    ]
  }],
  importantNotes: 'Property verified on site. All measurements confirmed.',
};

// PropertySummary component that replicates the exact UI from PropertySummary.tsx
const PropertySummaryStorybook: React.FC<{ mode?: 'create' | 'verify' | 'draft' }> = ({ 
  mode = 'create' 
}) => {
  const [loading, setLoading] = useState(false);
  const [importantNote, setImportantNote] = useState(mockPropertyData.importantNotes || '');
  const [unitOfMeasurement] = useState('m');

  // Helper function to format coordinates for display
  const formatCoordinates = (lat: number, lng: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
  };

  // Extract uploaded documents from mockPropertyData
  const documents = mockPropertyData.documents?.[0]?.files?.map((file, idx) => ({
    id: file.fileStoreId || (idx + 1).toString(),
    name: file.fileName,
    type: file.fileType,
    size: file.fileSize,
    uploadDate: file.dateOfUpload,
    status: 'uploaded',
  })) || [];

  // Extract first owner from mockPropertyData
  const owner = mockPropertyData.owners?.[0];

  // Handler for navigating to previous step
  const onPrevious = () => {
    console.log('Navigate to previous step');
  };

  // Handler for saving draft
  const onSaveDraft = () => {
    console.log('Save draft');
  };

  // Handler for final confirmation/verification
  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Property action completed:', mode);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Operation failed:', error);
    }
  };

  return (
    <>
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
            <span className="step-header-btn-text">Previous</span>
          </button>
          <button
            style={{ paddingLeft: '5%', paddingRight: '5%', backgroundColor: 'white' }}
            className="step-header-btn-style"
            onClick={onSaveDraft}
          >
            <SaveOutlinedIcon className="step-header-btn-icon" />
            <span className="step-header-btn-text">Save Draft</span>
          </button>
        </div>

        <div className="summary-header" style={{ marginLeft: '20px' }}>
          <h1>Property Summary</h1>
          <p className="summary-subtitle">Verify property information before submission</p>
        </div>

        <div className="summary-content" style={{ margin: '20px' }}>
          {/* Property Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div className="section-header">
              <div className="section-title">Property Details</div>
              <div className="header-buttons">
                <button
                  className="edit-btn"
                  onClick={() => console.log('Edit property details')}
                >
                  <img src={editIcon} alt="Edit" className="edit-icon" />
                </button>
              </div>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">Property Type</div>
                <div className="detail-value">{mockPropertyData.propertyType}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Zone, Ward</div>
                <div className="detail-value">
                  {mockPropertyData.propertyAddress?.ZoneNo || ''},{' '}
                  {mockPropertyData.propertyAddress?.WardNo || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Door No</div>
                <div className="detail-value">
                  {mockPropertyData.isgrDetails?.doorNoFrom || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Plot Area</div>
                <div className="detail-value">
                  {mockPropertyData.assessmentDetails?.ExtentOfSite
                    ? `${mockPropertyData.assessmentDetails?.ExtentOfSite} Sq.${unitOfMeasurement}`
                    : ''}
                </div>
              </div>

              {/* Location Details */}
              {mockPropertyData.locationData ? (
                <>
                  <div className="detail-row">
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{mockPropertyData.locationData.address}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">Coordinates</div>
                    <div className="detail-value">
                      {formatCoordinates(
                        mockPropertyData.locationData.coordinates?.lat!,
                        mockPropertyData.locationData.coordinates?.lng!
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* IGSR Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div className="section-header">
              <div className="section-title">IGRS Details</div>
              <button
                className="edit-btn"
                onClick={() => console.log('Edit IGRS details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">Survey Number</div>
                <div className="detail-value">{mockPropertyData.isgrDetails?.igrsWard || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Subdivision</div>
                <div className="detail-value">
                  {mockPropertyData.isgrDetails?.igrsBlock || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">GIS Reference</div>
                <div className="detail-value">
                  {mockPropertyData.isgrDetails?.igrsLocality || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Cadastral Map</div>
                <div className="detail-value">
                  {mockPropertyData.isgrDetails?.habitation || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">IGRS Registration</div>
                <div className="detail-value">
                  {mockPropertyData.isgrDetails?.doorNoFrom || ''}
                </div>
              </div>
            </div>
          </div>

          {/* Owner Information Card */}
          <div className="summary-section" style={{ background: '#FBEEE8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div className="section-header">
              <div className="section-title">Owner Information</div>
              <button
                className="edit-btn"
                onClick={() => console.log('Edit owner details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">Owner Name</div>
                <div className="detail-value">{owner?.Name || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Mobile Number</div>
                <div className="detail-value">{owner?.ContactNo || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email</div>
                <div className="detail-value">{owner?.Email || ''}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Address</div>
                <div className="detail-value">{mockPropertyData.propertyAddress?.Locality || ''}</div>
              </div>
            </div>
          </div>

          {/* Assessment Details Card */}
          <div className="summary-section" style={{ background: '#FBEEE8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div className="section-header">
              <div className="section-title">Assessment Details</div>
              <button
                className="edit-btn"
                onClick={() => console.log('Edit assessment details')}
              >
                <img src={editIcon} alt="Edit" className="edit-icon" />
              </button>
            </div>
            <div className="section-content">
              <div className="detail-row">
                <div className="detail-label">Building Usage</div>
                <div className="detail-value">
                  {mockPropertyData.assessmentDetails?.ReasonOfCreation || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Construction Year</div>
                <div className="detail-value">
                  {mockPropertyData.assessmentDetails?.OccupancyCertificateDate || ''}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Floor Count</div>
                <div className="detail-value">{mockPropertyData.floors?.length || 0}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Built-up Area</div>
                <div className="detail-value">
                  {mockPropertyData.floors?.some((floor) => floor.plinthArea)
                    ? `${mockPropertyData.floors.reduce(
                        (acc, floor) => acc + (Number(floor.plinthArea) || 0),
                        0
                      )} Sq.${unitOfMeasurement}`
                    : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="documents-section" style={{ marginBottom: '20px' }}>
            <div className="documents-title">Documents Uploaded</div>
            <div className="document-icons">
              {documents.map((d) => (
                <div key={d.id} className="document-icon">
                  <div className="doc-icon">
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
          <div className="important-note-section" style={{ borderRadius: '12px', marginBottom: '24px' }}>
            <div className="note-header">
              <label className="note-label" style={{ fontStyle: 'italic' }}>
                Important Note
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

          {/* Confirm Section */}
          <div
            className="confirm-section"
            style={{ margin: 'none', justifyContent: 'left' }}
          >
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
              {mode === 'verify' ? 'Verify' : loading ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Storybook Meta
const meta: Meta<typeof PropertySummaryStorybook> = {
  title: 'Agent/PropertySummary',
  component: PropertySummaryStorybook,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['create', 'verify', 'draft'],
      description: 'The mode of the property summary (create, verify, or draft)',
    },
  },
};
export default meta;
type Story = StoryObj<typeof PropertySummaryStorybook>;

// Stories
export const CompleteSummary: Story = {
  args: {
    mode: 'create',
  },
};