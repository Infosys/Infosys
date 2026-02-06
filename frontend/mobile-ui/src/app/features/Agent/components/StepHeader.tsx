// StepHeader displays a multi-step header with title, subtitle, step progress, and navigation buttons.
// Used in Agent property workflows to show progress and provide navigation actions.
import React from 'react';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import '../../../../styles/Agent/StepHeader.css';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

// Props for StepHeader:
//   - title: main header title
//   - subtitle: subheader text
//   - steps: total number of steps (default 6)
//   - activeStep: current active step (default 0)
//   - onPrevious: callback for previous button
//   - previousText: label for previous button
//   - onSaveDraft: callback for save draft button
//   - saveDraftText: label for save draft button
export interface StepHeaderProps {
  title: string;
  subtitle: string;
  steps?: number;
  activeStep?: number;
  onPrevious?: () => void;
  previousText?: string;
  onSaveDraft?: () => void;
  saveDraftText?: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  subtitle,
  steps = 6,
  activeStep = 0,
  onPrevious,
  previousText = "Previous",
  onSaveDraft,
  saveDraftText = "Save Draft",
}) => {
  // Render step header with title, subtitle, step progress, and navigation buttons
  return (
    <div style={{borderRadius:"0"}} className="step-header-container">
      {/* Main header section */}
      <div className="step-header-main">
        <div>
          <h1 className="step-header-title">{title}</h1>
          <div className="step-header-subtitle">{subtitle}</div>
        </div>
      </div>
      {/* Step progress indicator */}
      <div className="step-header-tabs-group">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={`step-header-tab${i <= activeStep ? ' active' : ''}`}
          />
        ))}
      </div>
      {/* Navigation buttons: Previous and Save Draft */}
      <div className="step-header-buttons">
        <button style={{paddingLeft:"5%", paddingRight:"5%"}} className="step-header-btn-style" onClick={onPrevious}>
          <ArrowBackIosNewIcon className="step-header-btn-icon" />
          <span className="step-header-btn-text">{previousText}</span>
        </button>
        <button style={{paddingLeft:"5%", paddingRight:"5%"}} className="step-header-btn-style" onClick={onSaveDraft}>
          <SaveOutlinedIcon className="step-header-btn-icon" />
          <span className="step-header-btn-text">{saveDraftText}</span>
        </button>
      </div>
    </div>
  );
};

// Export StepHeader for use in Agent screens
export default StepHeader;