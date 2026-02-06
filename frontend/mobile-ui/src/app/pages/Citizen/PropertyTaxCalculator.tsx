import React from 'react';
import { Box, List, ListItem } from '@mui/material';
import NavBar from '../../components/NavBar';
import CottageOutlined from '@mui/icons-material/CottageOutlined';
import Header from '../../components/Header';
import TaxPropertyCard from '../../features/Citizen/components/TaxPropertyCard';
import { useLocation } from 'react-router-dom';
import type { CitizenPropertySummary } from '../../features/Citizen/api/CitizenHomePageApi/CitizenHomePageModel';


const PropertyTaxCalculator: React.FC = () => {
    const location = useLocation();
  const properties = location.state?.properties ?? [] as CitizenPropertySummary[];
  
  return (
    <Box
      sx={{
        bgcolor: '#F5F5F5',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: 400,
        mx: 'auto',
        position: 'relative',
      }}
    >
      <Header
        header="My Properties"
        subHeader="Property Information"
        icon={<CottageOutlined sx={{ fontSize: 32 }} />}
      />

      <NavBar />

    
        {/* Property Cards List */}

      <List sx={{display: 'flex', flexDirection: 'column', gap: 0, p: 2, mt:22}}>
        {properties.map((prop: CitizenPropertySummary) => (
            <ListItem key={prop.ID}>
                <TaxPropertyCard
            property={prop}
            propertyId={prop.ID ?? ''}
            
          />
        
            </ListItem>
       ))}
      </List>
    </Box>
  );
};
export default PropertyTaxCalculator;
