import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import qrcode from '../../../assets/Citizen/licenses/qrcode.svg';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import '../../../../styles/Citizen/LicenseCertificate.css';

type Props = {
  title?: string;
  subtitle?: string;
  validUntil?: string;
  amount?: string;
  qrSrc?: string;
  onView?: () => void;
  onDownload?: () => void;
};

const LicenseCertificate: React.FC<Props> = ({
  title = 'Electrical Safety Certificate',
  subtitle = 'Valid until 2026-27-02',
  // validUntil = '2026-27-02',
  amount = '₹6,000',
  qrSrc,
  onView,
  onDownload,
}) => {
  return (
    <Paper className="lcert-card" elevation={0} role="group" aria-label="License certificate">
      <Box className="lcert-top-row">
        <Box className="lcert-top-left">
          <Typography className="lcert-title">{title}</Typography>
          <Typography className="lcert-sub">{subtitle}</Typography>
        </Box>

        <Box className="lcert-top-right">
          <Box className="lcert-status">
            <Typography className="lcert-status-text">Active</Typography>
            <CheckCircleOutlineIcon className="lcert-status-icon" />
          </Box>

          <Box className="lcert-qr-wrap" aria-hidden={!qrSrc}>
            {qrSrc ? (
              <img src={qrSrc} alt="QR code" className="lcert-qr-image" width={48} height={48} />
            ) : (
              <img src={qrcode} alt="QR code" className="lcert-qr-placeholder" width={48} height={48} />
            )}
          </Box>
        </Box>
      </Box>

      <Box className="lcert-separator" />

      {/* Bottom grey strip: amount left, action icons in boxed column on the right */}
      <Box className="lcert-bottom-strip">
        <Box className="lcert-amount-area" aria-hidden={false}>
          <Typography className="lcert-amount-value">{amount}</Typography>
        </Box>

        <Box className="lcert-right-actions" role="group" aria-label="actions">
          <Box className="lcert-action-box">
            <IconButton
              aria-label="view details"
              className="lcert-action-iconbtn"
              onClick={onView}
              title="View Details"
              size="large"
            >
              <VisibilityOutlinedIcon className="lcert-action-icon" />
            </IconButton>
            <Typography className="lcert-action-label">View Details</Typography>
          </Box>

          <Box className="lcert-action-box">
            <IconButton
              aria-label="download"
              className="lcert-action-iconbtn"
              onClick={onDownload}
              title="Download"
              size="large"
            >
              <FileDownloadOutlinedIcon className="lcert-action-icon" />
            </IconButton>
            <Typography className="lcert-action-label">Download</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default LicenseCertificate;