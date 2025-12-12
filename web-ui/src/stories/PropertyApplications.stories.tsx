import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Button, Card, CardContent, Chip, Container, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SourceIcon from '@mui/icons-material/Source';

interface PropertyApplication {
  id: string;
  title: string;
  applicationId: string;
  location: string;
  date: string;
  time: string;
  tags: { label: string; variant: 'outlined' | 'filled' }[];
  hasInfo?: boolean;
}

const PropertyApplicationCard: React.FC<{ application: PropertyApplication; onViewApplication?: (id: string) => void }> = ({ application, onViewApplication }) => (
  <Card variant="outlined" sx={{ borderColor: '#0B4B66', mb: 2 }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flex: 1 }}>
          <ArticleIcon sx={{ color: '#6b7280', fontSize: 20, mt: 0.2 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#6b7280', fontSize: '16px', lineHeight: 1.2, fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                {application.title}
              </Typography>
              {application.hasInfo && <InfoOutlinedIcon sx={{ color: '#6b7280', fontSize: 16 }} />}
            </Box>
            <Typography variant="body2" sx={{ color: '#000000', fontSize: '12px', mt: 0.25, fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {application.applicationId}
            </Typography>
          </Box>
        </Box>

        <Button variant="contained" size="small" onClick={() => onViewApplication?.(application.id)} sx={{ backgroundColor: '#0B4B66', color: 'white', textTransform: 'none', fontSize: '12px', fontWeight: 600, borderRadius: '6px', padding: '6px 16px', '&:hover': { backgroundColor: '#0d665c' } }}>
          View Application
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, ml: '29px' }}>
          <Typography variant="body2" sx={{ color: '#1f2937', fontSize: '14px', fontWeight: 500, lineHeight: 1.2 }}>{application.location}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={`${application.date} ${application.time}`} size="small" sx={{ backgroundColor: 'white', color: '#000000', fontSize: '11px', height: 24, borderRadius: '12px', border: '1px solid #000000', '& .MuiChip-label': { padding: '0 8px' } }} />
            {application.tags.map((tag, i) => (
              <Chip
                key={i}
                label={
                  tag.label === 'Commercial' ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <SourceIcon sx={{ fontSize: 14 }} />
                      <span>{tag.label}</span>
                    </Box>
                  ) : (
                    tag.label
                  )
                }
                variant={tag.variant}
                size="small"
                sx={{
                  fontSize: '11px',
                  height: 24,
                  borderRadius: '12px',
                  border: '1px solid #000000',
                  color: '#000000',
                  backgroundColor: 'white',
                  '& .MuiChip-label': { padding: '0 8px' }
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Box sx={{ width: 109, height: 71, backgroundColor: '#f3f4f6', borderRadius: 1, border: '1px solid #e5e7eb' }} />
          <Box sx={{ width: 109, height: 71, backgroundColor: '#f3f4f6', borderRadius: 1, border: '1px solid #e5e7eb' }} />
          <Box sx={{ width: 109, height: 71, backgroundColor: '#f3f4f6', borderRadius: 1, border: '1px solid #e5e7eb' }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const mockApplications: PropertyApplication[] = [
  { id: '1', title: 'Gandhi Nagar Complex', applicationId: 'PRP-2024-045', location: 'MG Road • Ward 108 • Zone 3 - Central', date: '14 Sept 2025', time: '10:30', tags: [{ label: 'Commercial', variant: 'outlined' }, { label: 'Enumeration', variant: 'outlined' }], hasInfo: true },
  { id: '2', title: 'Brodipet Commercial', applicationId: 'PRP-2024-044', location: 'Indiranagar • Ward 85 • Zone 5 - East', date: '20 Sept 2025', time: '09:15', tags: [{ label: 'Commercial', variant: 'outlined' }, { label: 'Enumeration', variant: 'outlined' }], hasInfo: true }
];

const PropertyApplicationsList: React.FC<{ applications?: PropertyApplication[]; title?: string }> = ({ applications = mockApplications, title = 'Property Applications' }) => (
  <Container maxWidth="md" sx={{ py: 4 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>{title}</Typography>
    <Box>
      {applications.map((app) => (
        <PropertyApplicationCard key={app.id} application={app} onViewApplication={(id) => console.log('View', id)} />
      ))}
    </Box>
  </Container>
);

const meta: Meta<typeof PropertyApplicationCard> = {
  title: 'Commissioner Dashboard/PropertyApplications',
  component: PropertyApplicationCard
};

export default meta;
type Story = StoryObj<typeof PropertyApplicationCard>;

export const DefaultCard: Story = { args: { application: mockApplications[0] } };
export const ApplicationsListStory: StoryObj<typeof PropertyApplicationsList> = { render: () => <PropertyApplicationsList /> };