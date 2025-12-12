import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import { JurisdictionDropdown } from '../../../components/JurisdictionDropdown/JurisdictionDropdown';
import { RecalibrationStatsCard } from '../components/RecalibrationStatsCard';
import { CalculationRuleCard } from '../components/CalculationRuleCard';
import { RecalibrationHistoryCard } from '../components/RecalibrationHistoryCard';

export const DemandGeneration: React.FC = () => {
  const statsData = [
    { title: 'Total Recalibrations', value: '12', highlightColor: '#000' },
    { title: 'Last Recalibration', value: 'Oct 1, 2024', highlightColor: '#000' },
    { title: 'Active Rules', value: '3', highlightColor: '#000' },
    { title: 'Avg. Processing Time', value: '2h 28m', highlightColor: '#000' },
  ];

  const activeRules = [
    {
      title: 'Annual Property Tax Rate',
      formula: 'Formula: Base Rate × Area × Usage Factor + rebate - arrears\nBase Rate: ₹25/sq.ft, Usage Factor: 1.0-2.5',
      date: '01 Jan 2025 (v3)',
    },
    {
      title: 'Quarterly Inflation Adjustment',
      formula: 'Formula: Previous Tax × (1 + Inflation Rate)\nInflation Rate: 6.5% annually',
      date: '01 Jan 2025 (v3)',
    },
    {
      title: 'Priority Management - Enumeration',
      formula: 'Formula: 30 days from SLA date - Breach: <5 days to SLA - High: <15 days to SLA - Else: Low',
      date: '01 Jan 2025 (v3)',
    },
  ];

  const recalibrationHistory = [
    {
      period: 'Q4 2024',
      triggeredBy: 'Rajesh Kumar',
      date: '2024-10-01',
      properties: '45,231',
      avgChange: '+8.5%',
      duration: '2h 34m',
    },
    {
      period: 'Q3 2024',
      triggeredBy: 'System Auto',
      date: '2024-07-01',
      properties: '44,890',
      avgChange: '+6.2%',
      duration: '2h 18m',
    },
    {
      period: 'Q2 2024',
      triggeredBy: 'Priya Sharma',
      date: '2024-04-01',
      properties: '44,890',
      avgChange: '+6.2%',
      duration: '2h 45m',
    },
  ];

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', p: 3, pl: 8 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5, fontFamily: 'Roboto' }}>
              Demand Generation & Recalibration
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#6b7280', fontFamily: 'Roboto' }}>
              Manage tax calculation rules and recalibration
            </Typography>
          </Box>
          <JurisdictionDropdown 
            backgroundColor="#10729B40"
            hoverBackgroundColor="#10729B60"
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#C84C0E',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '10px 24px',
              textTransform: 'none',
              boxShadow: '0 2px 4px rgba(200, 76, 14, 0.2)',
              '&:hover': {
                backgroundColor: '#b34309',
                boxShadow: '0 4px 8px rgba(200, 76, 14, 0.3)',
              }
            }}
          >
            + Trigger Recalibration
          </Button>
        </Box>
      </Box>

      {/* Info Card */}
      <Box
        sx={{
          backgroundColor: '#d9e9f7',
          border: '1.5px solid #6ba3d1',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#1976d2', fontSize: 28 }} />
        <Box>
          <Typography sx={{ color: '#1976d2', fontWeight: 500, fontSize: '15px', fontFamily: 'Roboto' }}>
            Next scheduled recalibration:
          </Typography>
          <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '15px', fontFamily: 'Roboto' }}>
            Q1 2025 on 2025-01-01.
          </Typography>
          <Typography sx={{ color: '#1976d2', fontSize: '15px', fontFamily: 'Roboto' }}>
            Estimated to affect 45,500 properties.
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', mb: 3, gap: 2 }}>
        {statsData.map((stat, index) => (
          <Box key={index} sx={{ flex: 1, display: 'flex' }}>
            <RecalibrationStatsCard {...stat} />
          </Box>
        ))}
      </Box>

      {/* Main Content: Active Rules and History */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Active Calculation Rules */}
        <Box sx={{ flex: 1, width: '50%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#C84C0E', fontFamily: 'Roboto' }}>
              Active Calculation Rules
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              sx={{
                color: '#C84C0E',
                fontSize: '14px',
                fontWeight: 500,
                border: '1.5px solid #C84C0E',
                borderRadius: '8px',
                padding: '2px 16px',
                textTransform: 'none',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(200, 76, 14, 0.04)',
                  border: '1.5px solid #C84C0E',
                }
              }}
            >
              Add New Rule
            </Button>
          </Box>
          <Box>
            {activeRules.map((rule, index) => (
              <CalculationRuleCard
                key={index}
                {...rule}
                onEdit={() => console.log('Edit rule:', rule.title)}
              />
            ))}
          </Box>
        </Box>

        {/* Recalibration History */}
        <Box sx={{ flex: 1, width: '50%' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#C84C0E', fontFamily: 'Roboto', mb: 2 }}>
            Recalibration History
          </Typography>
          <Box>
            {recalibrationHistory.map((item, index) => (
              <RecalibrationHistoryCard key={index} {...item} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
