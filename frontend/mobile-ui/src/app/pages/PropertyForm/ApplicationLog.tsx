// ApplicationLog.tsx
// Property Form Application Log page
// Displays a timeline of application events, comments, and status updates for a property
// Features:
//   - Shows mock log data (replaceable with backend fetch)
//   - Localized UI using useApplicationLogLocalization
//   - Navigation to Add Request/Comment, Verification, and Home
//   - Timeline UI with error, agent, and admin highlights
//   - Downloadable files and extra details for some log items
// Used in: Property form workflow for tracking application progress and history

import React, { useEffect, useState } from 'react';
import { ArrowBackIosNew, Download } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../../../styles/ApplicationLog.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useApplicationLogLocalization } from '../../../services/AgentLocalisation/localisation-applicationLog';
import { ApplicationApi } from '../../../redux/apis/ApplicationLog/getApplication';
import authService from '../../../services/AuthService';
import Button from '@mui/material/Button';
import { env } from '../../../config/env';

// LogItem: structure for each timeline event
interface LogItem {
  id: number;
  performedBy: string;
  actor: string;
  date?: string;
  title: string;
  // description?: string;
  files?: { name: string; url: string }[];
  extra?: React.ReactNode;
  isError?: boolean;
  isAgent?: boolean;
  isAdmin?: boolean;
}

const buttonStyleSx = {
  borderRadius: '10px',
  py: 0.4,
  px: 2,
  my: 1,
  color: '#c84c03',
  borderColor: '#c84c03',
  background: '#fff',
  fontWeight: 600,
  '&:hover': {
    borderColor: '#c84c03',
    background: '#fbeee6',
  },
};

// Mock data generator function (to be called with localized text)
const mapLogData = (data: any[]): LogItem[] =>
  [...data]
    .sort(
      (a, b) => new Date(a.PerformedDate).getTime() - new Date(b.PerformedDate).getTime()
    )
    .map((item, idx) => ({
      id: idx + 1,
      actor: item.Actor,
      title: item.Comments,
      Comments: item.Comments,
      performedBy: item.PerformedBy,
      date: item.PerformedDate,
    }));

export const ApplicationLog: React.FC = () => {
  // State for log items and loading indicator
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Navigation and route params
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const applicationId = localStorage.getItem('applicationId') || localStorage.getItem('applicationLogId');
  // Use RTK Query hook to fetch application data
  const { data } = ApplicationApi.useGetApplicationByPropertyIdQuery(
    applicationId ?? '',
    { refetchOnMountOrArgChange: true }
  );
  console.log('Application data:', data);
  const applicationLogs = data?.data.ApplicationLogs || [];

  // Localization
  const loc = useApplicationLogLocalization();

  const handleAddRequest = () => {
    if (propertyId) {
      navigate(`/agent/add-comment/${propertyId}`);
    } else {
      navigate('/agent/add-comment');
    }
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate('/agent');
  };

  useEffect(() => {
    const mapped = mapLogData(applicationLogs);
    setLogItems(mapped);
    setLoading(false);
  }, [applicationLogs]);
  // Check if any log item actor is 'citizen'
  // const isCitizenActor = logItems.some(item => item.actor?.toUpperCase() === 'CITIZEN');
  const isCitizenActor = authService.isCitizen();

  // Helper function to preview images and PDFs
  const previewFile = async (fileStoreId: string, fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const url = `${env.FILESTORE_HOST}/filestore/v1/files/${fileStoreId}?tenantId=pg`;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
        // Open image in new tab
        const imgWindow = globalThis.window.open('', '_blank');
        if (imgWindow) {
          const img = imgWindow.document.createElement('img');
          img.src = blobUrl;
          img.style.maxWidth = '100%';
          img.style.maxHeight = '100vh';
          imgWindow.document.body.appendChild(img);
        }
      } else if (ext === 'pdf') {
        // Open PDF in new tab
        const pdfWindow = globalThis.window.open('', '_blank');
        if (pdfWindow) {
          const embed = pdfWindow.document.createElement('embed');
          embed.src = blobUrl;
          embed.type = 'application/pdf';
          embed.width = '100%';
          embed.height = '100%';
          pdfWindow.document.body.appendChild(embed);
        }
      } else {
        // Fallback: open blob URL (browser will download if unsupported)
        globalThis.window.open(blobUrl, '_blank');
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="log-outer-bg">
      <div className="property-form-container">
        <div className="property-form-header">
          <div className="header-content">
            <h1
              className="form-title"
              style={{
                paddingLeft: '5%',
                paddingRight: '5%',
                marginTop: '10%',
                fontSize: '24px',
              }}
            >
              {loc.applicationLogTitle}
            </h1>
            <div
              className="form-subtitle"
              style={{ paddingLeft: '5%', paddingRight: '5%', fontSize: '16px' }}
            >
              {loc.commentHistorySubtitle}{' '}
              <span className="app-log-viewed">{loc.viewedByApplicantText}</span>
            </div>

            <div className="step-header-buttons">
              <button
                style={{ paddingLeft: '5%', paddingRight: '5%' }}
                className="step-header-btn-style"
                onClick={handlePrevious}
              >
                <ArrowBackIosNew className="step-header-btn-icon" />
                <span className="step-header-btn-text">{loc.previousText}</span>
              </button>
              <button
                style={{ paddingLeft: '5%', paddingRight: '5%' }}
                className="step-header-btn-style"
                onClick={handleHome}
              >
                <HomeOutlinedIcon className="step-header-btn-icon" />
                <span className="step-header-btn-text">{loc.homeText}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="app-log-content">
          {loading && (
            <div className="log-loading">
              <span className="log-loading-spinner">↻</span> {loc.loadingText}
            </div>
          )}
          {!loading && (
            <>
              {logItems.map((item, idx) => {
                // Find the corresponding log object for this item
                const logObj = applicationLogs.find(
                  (log) =>
                    log.Actor === item.actor &&
                    log.PerformedBy === item.performedBy &&
                    log.Comments === item.title &&
                    log.PerformedDate === item.date
                );
                return (
                  <div className="app-log-item" key={item.id}>
                    <div className="app-log-step">
                      <div className="app-log-circle">{idx + 1}</div>
                      <div className="app-log-details">
                        <div className="app-log-title">
                          <strong> {item.actor}</strong>
                        </div>
                        <strong> {item.performedBy}</strong>
                        {item.title && <div className="app-log-desc">{item.title}</div>}
                        {logObj?.FileStoreID && (
                          <div>
                            <div className="filebox-row">
                              {/* Show file name if present */}
                              {(() => {
                                let fileName = 'Document';
                                if (logObj?.Metadata) {
                                  try {
                                    const meta = JSON.parse(logObj.Metadata);
                                    if (meta?.file?.name) fileName = meta.file.name;
                                  } catch (e) {
                                    console.error('Error parsing metadata JSON:', e);
                                  }
                                }
                                return (
                                  fileName && (
                                    <div className="filebox-fileinfo">
                                      <span className="filebox-icon">
                                        <DescriptionIcon style={{ color: '#333' }} />
                                      </span>
                                      <span
                                        className="filebox-filename"
                                        style={{ color: 'gray' }}
                                      >
                                        {fileName}
                                      </span>
                                    </div>
                                  )
                                );
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Download card if FileStoreID is present for this log */}
                        {logObj?.FileStoreID && (
                          <div
                            className="commentreq-filebox"
                            style={{ marginTop: '0px', display: 'flex', gap: '8px' }}
                          >
                            {isCitizenActor ? (
                              <Button
                                variant="outlined"
                                sx={buttonStyleSx}
                                className="filebox-download"
                                onClick={async () => {
                                  // Get file name from metadata or fallback
                                  let fileName = 'Document';
                                  if (logObj?.Metadata) {
                                    try {
                                      const meta = JSON.parse(logObj.Metadata);
                                      if (meta?.file?.name) fileName = meta.file.name;
                                    } catch (e) {
                                      console.log(e);
                                    }
                                  }
                                  await previewFile(logObj.FileStoreID ?? '', fileName);
                                }}
                                startIcon={<VisibilityIcon />}
                              >
                                View Doc
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                sx={buttonStyleSx}
                                className="filebox-download"
                                onClick={() => {
                                  const url = `${env.FILESTORE_HOST}/filestore/v1/files/${logObj.FileStoreID}?tenantId=pg`;
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = '';
                                  document.body.appendChild(link);
                                  link.click();
                                  link.remove();
                                }}
                                startIcon={<Download />}
                              >
                                Download Doc
                              </Button>
                            )}
                          </div>
                        )}
                        {item.date && (
                          <div className="app-log-desc">
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        )}
                        {item.extra}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {/* Add Request button below the timeline box, not inside it */}
        <div className="app-log-footer">
          {!isCitizenActor && (
            <button className="app-log-add-btn" onClick={handleAddRequest}>
              {loc.addRequestText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationLog;
