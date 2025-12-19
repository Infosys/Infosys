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

// Mock data generator function (to be called with localized text)
const mapLogData = (data: any[]): LogItem[] =>
  [...data]
    .sort((a, b) => new Date(a.PerformedDate).getTime() - new Date(b.PerformedDate).getTime())
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

  const applicationId = localStorage.getItem('applicationId');
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

    // Log each log item with labels
    mapped.forEach((item, idx) => {
      console.log(`Log Item #${idx + 1}:`);
      console.log(`  Actor: ${item.actor}`);
      console.log(`  Performed By: ${item.performedBy}`);
      console.log(`  Comments: ${item.title}`);
      console.log(`  Date: ${item.date}`);
      // Add more fields if needed
    });
  }, [applicationLogs]);
  // Check if any log item actor is 'citizen' 
  const isCitizenActor = logItems.some(item => item.actor?.toUpperCase() === 'CITIZEN');

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
                                          <DescriptionIcon style={{color:'gray'}}/>
                                      </span>
                                      <span className="filebox-filename" style={{color:'gray'}}>{fileName}</span>
                                    </div>
                                  )
                                );
                              })()}
                            </div>
                          </div>
                        )}
                        {/* Download card if FileStoreID is present for this log */}
                        {logObj?.FileStoreID && (
                          <div className="commentreq-filebox" style={{ marginTop: '0px' }}>
                            {isCitizenActor ? (
                              <button
                                className="filebox-download"
                                onClick={() => {
                                  const url = `${
                                    import.meta.env.VITE_FILESTORE_HOST
                                  }/filestore/v1/files/${
                                    logObj.FileStoreID
                                  }?tenantId=pg`;
                                  window.open(url, '_blank');
                                }}
                              >
                                <VisibilityIcon style={{ marginRight: 0 }} /> <span style={{fontWeight:'600'}}>View Doc</span>
                              </button>
                            ) : (
                              <button
                                className="filebox-download"
                                onClick={() => {
                                  const url = `${
                                    import.meta.env.VITE_FILESTORE_HOST
                                  }/filestore/v1/files/${
                                    logObj.FileStoreID
                                  }?tenantId=pg`;
                                  window.open(url, '_blank');
                                }}
                              >
                                <Download style={{ marginRight: 0 }} /> <span style={{fontWeight:'600'}}>Download Doc</span>
                              </button>
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
