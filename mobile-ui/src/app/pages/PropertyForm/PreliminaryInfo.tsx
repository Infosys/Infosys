// PreliminaryInfo page for collecting initial property details in the form flow
import { type FC, Fragment, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Radio,
  Button,
  Stack,
  FormControl,
  FormControlLabel,
  RadioGroup,
} from '@mui/material';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import WeekendOutlinedIcon from '@mui/icons-material/WeekendOutlined';
import StepHeader from '../../features/Agent/components/StepHeader';
import CountIncrementor from '../../features/PropertyForm/components/CountIncrementors';
import { useNavigate } from 'react-router-dom';

// Types for property card options
type CardType = 'vacant' | 'structure' | 'multi' | 'unit';

// Icons for each property card type
const cardIcons: Record<CardType, React.ReactNode> = {
  vacant: <CasinoOutlinedIcon sx={{ fontSize: "32px", color: '#000000bf'}} />,
  structure: <CottageOutlinedIcon sx={{ fontSize: "32px", color: '#000000bf'}} />,
  multi: <DomainAddOutlinedIcon sx={{ fontSize: "32px", color: '#000000bf' }} />,
  unit: <WeekendOutlinedIcon sx={{ fontSize: "32px", color: '#000000bf'}} />,
};

// Labels for each property card type
const cardLabels: Record<CardType, string> = {
  vacant: 'Vacant land',
  structure: 'Land with structure',
  multi: 'Land with multiple structures',
  unit: 'Building unit',
};

// Main component for preliminary property info step
export const PreliminaryInfo: FC = () => {
  // State for selected card, floor/basement counts, and mezzanine option
  const [active, setActive] = useState<CardType | null>(null);
  const [floors, setFloors] = useState(0);
  const [basements, setBasements] = useState(0);
  const [mezzanine, setMezzanine] = useState('no');
  const navigate = useNavigate();
  // Key for saving form data in localStorage
  const LOCAL_STORAGE_KEY = 'propertyFormData';

  // List of selectable property cards (order of display)
  const cardOrder: CardType[] = ['vacant', 'structure', 'multi', 'unit'];

  // Helper function for rendering extra form fields for certain card types
  const renderFormByType = (type: CardType) => {
    if (type === 'structure' && active === 'structure') {
      return (
        <Box px={2} pb={2}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <CountIncrementor
                label="No. of Floors"
                value={floors}
                setValue={setFloors}
                min={0}
                max={10}
              />
              <CountIncrementor
                label="No. of Basements"
                value={basements}
                setValue={setBasements}
                min={0}
                max={5}
              />
            </Stack>
            <FormControl
              fullWidth
              size="small"
              sx={{
                mb: 0,
                mt: 0,
              }}
            >
              <Typography sx={{ mb: 1, fontWeight: 'light', fontSize: 16 }}>
                Does this structure have a Mezzanine Floor?
              </Typography>
              <RadioGroup
                row
                value={mezzanine}
                onChange={(e) => setMezzanine(e.target.value)}
                sx={{ gap: 2 }}
              >
                <FormControlLabel
                  value="no"
                  control={<Radio sx={{ color: "#00000080", '&.Mui-checked': { color: "#c84c0e" } }} />}
                  label="No"
                />
                <FormControlLabel
                  value="yes"
                  control={<Radio sx={{ color: "#00000080", '&.Mui-checked': { color: "#c84c0e" } }} />}
                  label="Yes"
                />
              </RadioGroup>
            </FormControl>
          </Stack>
        </Box>
      );
    }
    if (type === 'multi' && active === 'multi') {
      return (
        <Box px={2} pb={2}>
         <Stack direction="row" spacing={2}>
              <CountIncrementor
                label="No. of Floors"
                value={floors}
                setValue={setFloors}
                min={0}
                max={10}
              />
              <CountIncrementor
                label="No. of Basements"
                value={basements}
                setValue={setBasements}
                min={0}
                max={5}
              />
            </Stack>
        </Box>
      );
    }
    return null;
  };

  // Handler for Continue button: saves form data and navigates to next step
  const handleContinue = () => {
    const formData = {
      propertyType: active,
      floors,
      basements,
      mezzanine: active === 'structure' ? mezzanine : undefined,
    };
    // Save locally
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      navigate('/property-form/property-information');
    } catch (e) {
      // Handle localStorage error (optional)
    }
    // Print (console output for developer)
    console.log('Saved Property Form:', formData);
    // You can trigger next step navigation here if required
  };

  // Main UI rendering
  return (
    <Box
      maxWidth={420}
      width="100%"
      mx="auto"
      bgcolor="#fff"
      display="flex"
      flexDirection="column"
      minHeight="100vh"
    >
      {/* Step header for navigation and progress */}
      <StepHeader
        title={'Property Details'}
        subtitle={'Property Preliminary Information'}
        steps={10}
        activeStep={0}
        onPrevious={() => {
          navigate(-1);
        }}
        onSaveDraft={() => {}}
        previousText={'Previous'}
        saveDraftText={'Save Draft'}
      />

      {/* Property type cards and dynamic form fields */}
      <RadioGroup value={active ?? ''}>
        <Stack spacing={2} mb={2} mt={4} px={'6%'}>
          {cardOrder.map((key) => (
            <Fragment key={key}>
              <Card
                sx={{
                  mt: 1,
                  border: active === key ? '2px solid #c84c0ecb' : '1px solid #00000052',
                  bgcolor: active === key ? '#fbeee5a6' : '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  maxWidth: '100%',
                  height: '104px',
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CardActionArea
                  sx={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1.5,
                    px: 2,
                  }}
                  onClick={() => setActive(key)}
                >
                  <Radio
                    checked={active === key}
                    value={key}
                    sx={{ color: "#00000080", '&.Mui-checked': { color: "#c84c0e" } }}
                    tabIndex={-1}
                  />
                  <Box
                    sx={{
                      color: '#000000ad',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cardIcons[key]}
                  </Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography
                      sx={{ fontSize: 16, fontWeight: 'light' }}
                    >
                      {cardLabels[key]}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

              {/* Renders the dynamic field for card ONLY directly after this card */}
              {renderFormByType(key)}
            </Fragment>
          ))}
        </Stack>
      </RadioGroup>

      {/* Footer with Continue button */}
      <Box sx={{
        mt: "auto",
        pb: "4%",
        px: '6%',
        display: 'flex',
        justifyContent: 'end',
      }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#c84c0e',
            color: '#fff',
            fontWeight: 700,
            maxWidth: '50%',
            borderRadius: 2,
            py: 1.2,
            width: '100%',
            textTransform: 'none',
            fontSize: 16,
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#c84c0e',
              color: '#fff',
            },
          }}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PreliminaryInfo;