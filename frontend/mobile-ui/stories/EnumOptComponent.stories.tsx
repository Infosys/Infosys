import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import langReducer from '../src/redux/LangSlice';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type EnumOptComponent from '../src/app/features/Citizen/components/EnumOptComponent';
// Presentational copy of the EnumOptComponent UI so stories do not import localization

const store = configureStore({ reducer: { lang: langReducer } });

// No localization imports: use hard-coded labels here for story previews

const PresentationalEnumOpt: React.FC<any> = ({ property }) => {
  let progress = 50;
  if (property?.enumerationProgress !== undefined) {
    if (property.enumerationProgress === -1) progress = 0;
    else progress = property.enumerationProgress;
  }
  const lastUpdated = property?.UpdatedAt ? new Date(property.UpdatedAt).toLocaleDateString() : '';

  if (progress === 100) {
    return (
      <Paper elevation={0} sx={{ p: 1.2, mb: 1.7, borderRadius: 2, bgcolor: '#fff' }}>
        <Typography fontSize={13} sx={{ mb: 0.5, color: '#444' }}>
          Enumeration Complete
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={12} color="#888">Bills Due</Typography>
            <Typography fontWeight={700} fontSize={14}>0</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={12} color="#888">Bills Amount</Typography>
            <Typography fontWeight={700} fontSize={14}>0</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography fontSize={12} color="#888">Issued Licenses</Typography>
            <Typography fontWeight={700} fontSize={14}>0</Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 1.2, mb: 1.7, borderRadius: 2, bgcolor: '#fff' }}>
      <Typography fontSize={13} sx={{ mb: 0.5, color: '#444' }}>
        Enumeration Progress
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LinearProgress
          value={progress}
          variant="determinate"
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 4,
            background: '#F3E0D1',
            '& .MuiLinearProgress-bar': {
              backgroundColor: progress === 0 ? '#FFC107' : '#9E5F00',
            },
          }}
        />
        <Typography sx={{ color: '#000', fontSize: 13 }}>{progress}%</Typography>
      </Box>
      {lastUpdated && (
        <Typography fontSize={11} sx={{ color: '#888', mt: 0.5 }}>
          Last updated: {lastUpdated}
        </Typography>
      )}
    </Paper>
  );
};

const meta: Meta<typeof PresentationalEnumOpt> = {
  title: 'Citizen/Cards/ProgressIndicator',
  component: PresentationalEnumOpt,
};


type Story = StoryObj<typeof EnumOptComponent>;

export const Progress50: Story = {
  render: () => {
    const property = {
      enumerationProgress: 50,
      UpdatedAt: new Date().toISOString(),
    } as any;
    return (
      <Provider store={store}>
        <Box sx={{ width: 480, p: 2 }}>
          <PresentationalEnumOpt property={property} />
        </Box>
      </Provider>
    );
  },
};

export const Completed: Story = {
  render: () => {
    const property = {
      enumerationProgress: 100,
      UpdatedAt: new Date().toISOString(),
    } as any;
    return (
      <Provider store={store}>
        <Box sx={{ width: 480, p: 2 }}>
          <PresentationalEnumOpt property={property} />
        </Box>
      </Provider>
    );
  },
};

export default meta;