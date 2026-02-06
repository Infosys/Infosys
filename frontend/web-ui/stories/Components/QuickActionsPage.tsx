import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container
} from '@mui/material';

export interface QuickActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: 'contained' | 'outlined';
  onClick?: () => void;
}

export interface QuickActionsProps {
  actions?: QuickActionItem[];
  title?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions = [],
  title = "Quick Actions"
}) => {
  return (
    <Card
      sx={{
        borderRadius: '8px',
        boxShadow: 'none',
        border: '1px solid #e5e7eb',
        width: '100%',
        maxWidth: 280,
        backgroundColor: '#ffffff',
        fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#1f2937',
            fontSize: '16px'
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || 'outlined'}
              startIcon={action.icon}
              onClick={action.onClick}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '10px 16px',
                borderRadius: '6px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                height: '44px',
                ...(action.variant === 'contained' && {
                  backgroundColor: '#0B4B66',
                  color: 'white',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: '#093a50',
                  }
                }),
                ...(action.variant === 'outlined' && {
                  borderColor: '#0B4B66',
                  color: '#0B4B66',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#0B4B66',
                  }
                }),
                '& .MuiButton-startIcon': {
                  marginRight: '12px',
                  '& svg': {
                    fontSize: '18px'
                  }
                }
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export interface QuickActionsDashboardProps {
  actions?: QuickActionItem[];
}

export const QuickActionsDashboard: React.FC<QuickActionsDashboardProps> = ({
  actions = []
}) => {
  return (
    <Container maxWidth="sm" sx={{ py: 4, fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <QuickActions actions={actions} />
    </Container>
  );
};