

import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

export interface PendingRequest {
  id: string;
  name: string;
  designation: string;
  email: string;
  reason: string;
  level: string;
  requestLabel: string;
}

interface PendingRequestDetailProps {
  request: PendingRequest | null;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onDelete: (requestId: string) => void;
}

export const PendingRequestDetail: React.FC<PendingRequestDetailProps> = ({
  request,
  onApprove,
  onReject,
  onDelete,
}) => {
  if (!request) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F5F5',
          borderRadius: '12px',
          border: '1px solid #e3e8ee',
          minHeight: '400px',
        }}
      >
        <Typography sx={{ color: '#9ca3af', fontSize: '16px', fontFamily: 'Roboto' }}>
          Select a role to view pending requests
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '24px',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography
            sx={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f2937',
              mb: 0.5,
              fontFamily: 'Roboto',
            }}
          >
            Super Admin
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#6b7280',
              fontFamily: 'Roboto',
            }}
          >
            {request.requestLabel}
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon sx={{ fontSize: '18px' }} />}
          variant="contained"
          sx={{
            backgroundColor: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '8px 20px',
            textTransform: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: '#222',
              boxShadow: '0 4px 8px rgba(0,0,0,0.22)',
            },
          }}
        >
          Add New User
        </Button>
      </Box>

      {/* User Card */}
      <Box
        sx={{
          backgroundColor: '#F5F5F5',
          border: '1px solid #e3e8ee',
          borderRadius: '12px',
          padding: '20px',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                mb: 0.5,
                fontFamily: 'Roboto',
              }}
            >
              {request.name}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6b7280',
                mb: 0.5,
                fontFamily: 'Roboto',
              }}
            >
              {request.designation}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#6b7280',
                fontFamily: 'Roboto',
              }}
            >
              {request.email}
            </Typography>
          
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <IconButton
              onClick={() => onDelete(request.id)}
              sx={{
                color: '#ef4444',
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: '20px' }} />
            </IconButton>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                border: '1px solid #2176AE',
                borderRadius: '8px',
                fontSize: '12px',
                padding: '4px 12px',
                color: '#2176AE',
                background: '#E6F0FA',
                fontWeight: 500,
                fontFamily: 'Roboto',
                mt: 1,
              }}
            >
              {request.level}
            </Box>
          </Box>
        </Box>
            <Box sx={{ borderBottom: '1px solid #000000', my: 2 }} />

        {/* Reason */}
        <Typography
          sx={{
            fontSize: '14px',
            color: '#1f2937',
            lineHeight: 1.6,
            fontFamily: 'Roboto',
          }}
        >
          {request.reason}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            startIcon={<CheckIcon />}
            variant="outlined"
            onClick={() => onApprove(request.id)}
            sx={{
              flex: 1,
              color: '#0E76A2',
              fontSize: '14px',
              fontWeight: 500,
              border: '1.5px solid #0E76A2',
              borderRadius: '8px',
              padding: '6px 14px',
              minHeight: 0,
              textTransform: 'none',
              backgroundColor: '#fff',
              lineHeight: 1.2,
              '&:hover': {
                backgroundColor: '#eaf6fb',
                border: '1.5px solid #0E76A2',
              },
            }}
          >
            Approve
          </Button>
          <Button
            startIcon={<CloseIcon />}
            variant="contained"
            onClick={() => onReject(request.id)}
            sx={{
              flex: 1,
              backgroundColor: '#23506a',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '6px 14px',
              minHeight: 0,
              textTransform: 'none',
              lineHeight: 1.2,
              boxShadow: '0 2px 4px rgba(35, 80, 106, 0.2)',
              '&:hover': {
                backgroundColor: '#1e3a4e',
                boxShadow: '0 4px 8px rgba(35, 80, 106, 0.3)',
              },
            }}
          >
            Reject
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
