import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ScheduleDemandGenerationProps {
  title?: string;
  searchPlaceholder?: string;
  buttonText?: string;
  onSearch?: (value: string) => void;
  onGenerate?: () => void;
}

const ScheduleDemandGeneration: React.FC<ScheduleDemandGenerationProps> = ({
  title = "Schedule Demand Generation",
  searchPlaceholder = "Search Jurisdiction",
  buttonText = "Generate",
  onSearch,
  onGenerate
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <Card
      sx={{
        borderRadius: '8px',
        boxShadow: 'none',
        border: '1px solid #0B4B66',
        width: '100%',
        maxWidth: 320,
        backgroundColor: '#ffffff'
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Search Field */}
          <TextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '24px',
                backgroundColor: '#f9fafb',
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#d1d5db',
                },
                '&:hover fieldset': {
                  borderColor: '#9ca3af',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#3b82f6',
                  borderWidth: '1px'
                }
              },
              '& .MuiInputBase-input': {
                padding: '10px 14px',
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#6b7280',
                '&::placeholder': {
                  color: '#9ca3af',
                  opacity: 1,
                  fontStyle: 'italic'
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    sx={{
                      padding: '4px',
                      color: '#6b7280'
                    }}
                  >
                    {/* <SearchIcon fontSize="small" /> */}
                  </IconButton>
                  <IconButton
                    edge="end"
                    size="small"
                    sx={{
                      padding: '6px',
                      bgcolor: '#ffffff',
                      color: '#000000',
                      borderRadius: '50%',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#ffffff' }
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Generate Button */}
          <Button
            variant="outlined"
            onClick={onGenerate}
            fullWidth
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 24px',
              borderColor: '#0B4B66',
              color: '#0B4B66',
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#f9fafb',
                borderColor: '#0B4B66',
              }
            }}
          >
            {buttonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScheduleDemandGeneration;