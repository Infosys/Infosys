// PropertyList.tsx displays a list of property cards for the Citizen property list page.
// It receives an array of property summaries and renders a PropertyCard for each.
// Main responsibilities:
// - Map over properties and render PropertyCard for each
// - Pass property data as props to PropertyCard
// Props: properties (CitizenPropertySummary[]) - array of property summaries to display
import type { FC } from 'react';
import { Box } from '@mui/material';
import PropertyCard from '../PropertyCard';
import type { CitizenPropertySummary } from '../../api/CitizenHomePageApi/CitizenHomePageModel';

// PropertyList component: renders a list of PropertyCard components for each property
const PropertyList: FC<{ properties: CitizenPropertySummary[] }> = ({ properties }) => {
  return (
    <>
      {properties.map((prop: CitizenPropertySummary) => (
        <Box
          key={prop.ID}
          sx={{
            display: 'block',
            justifyContent: 'center',
          }}
        >
          {/* <PropertyCard property={prop} appId={prop.applicationID} /> */}
          <PropertyCard
            property={prop}
            propertyId={prop.ID ?? ''}
          />
        </Box>
      ))}
    </>
  );
};

// Export PropertyList for use in property list pages
export default PropertyList;