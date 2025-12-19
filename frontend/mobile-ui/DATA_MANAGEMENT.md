# Data Management & Filtering System

## Overview
The application now uses a centralized `db.json` file for all data instead of hardcoded values in components. This provides a clean separation of data and logic, making it easier to maintain and update.

## Database Structure

### `db.json` Structure
```json
{
  "properties": [...],      // Array of property items with filtering flags
  "location": {...},        // Location data with coordinates
  "searchResults": [...],   // Search results data
  "messages": [...],        // Inbox messages data  
  "insights": {...},        // Insights page data
  "drafts": [...]           // Draft properties data
}
```

### Property Item Schema
Each property item has the following structure:
- `id`: Unique property identifier
- `type`: Property type (Survey, Residential, Commercial)
- `description`: Property description
- `address`: Full address
- `dueDate`: Due date in YYYY-MM-DD format
- `status`: Priority level (High, Medium, Low)
- `phoneNumber`: Contact phone number
- `area`: Property area with units
- `propertyType`: Residential or Commercial
- `isVerified`: Boolean - true if property is verified/reviewed
- `isDraft`: Boolean - true if property is in draft status
- `isNew`: Boolean - true if property is newly created
- `createdDate`: Creation date in YYYY-MM-DD format

## Filtering System

The home page now supports four filter types:

### 1. All Button
- Shows all properties regardless of status
- Default view showing complete property list

### 2. New Button  
- Shows only properties where `isNew: true`
- Sorted by `createdDate` with latest first
- Helps identify recently added properties

### 3. Reviewed Button
- Shows only properties where `isVerified: true`
- Displays completed/verified properties

### 4. Draft Button
- Shows only properties where `isDraft: true`
- Special draft layout with continue functionality
- Shows map when "View Map" is clicked

## Data Service (`dataService.ts`)

### Key Functions
- `fetchData()`: Loads data from db.json
- `filterProperties()`: Filters properties by type
- `searchProperties()`: Search functionality
- `getPropertiesByStatus()`: Filter by priority status

### Usage Example
```typescript
import { fetchData, filterProperties } from './services/dataService';

// Load all data
const data = await fetchData();

// Filter for new properties
const newProperties = filterProperties(data.properties, 'new');
```

## Implementation Details

### App.tsx Changes
- Removed hardcoded `mockProperties` and `mockLocation`
- Added `useEffect` to fetch data on component mount
- Added loading state management
- Updated all data references to use fetched data

### HomePage.tsx Changes
- Added filtering logic with `useEffect`
- Updated calendar tab functionality
- Dynamic property rendering based on filter
- Added status badges (Verified, New)
- Improved draft mode with map toggle

### SearchPropertyPage.tsx Changes
- Removed hardcoded `mockSearchResults`
- Now uses `searchResults` prop from App component

## Benefits

1. **Centralized Data**: All data in one JSON file
2. **Easy Updates**: Modify db.json without touching code
3. **Flexible Filtering**: Multiple filter criteria
4. **Better UX**: Clear status indicators and sorting
5. **Maintainable**: Clean separation of concerns

## Complete Functionality Testing

### HomePage Filter Testing
1. **All**: Should show 7 properties total from db.json
2. **New**: Should show 2 properties (PRP-2025-003, PRP-2025-005) sorted by latest date first  
3. **Reviewed**: Should show 3 verified properties (PRP-2024-001, PRP-2024-234, PRP-2024-150)
4. **Draft**: Should show 2 draft properties (PRP-2024-002, PRP-2024-324) with special draft layout

### Other Pages Testing  
1. **SearchPropertyPage**: Uses searchResults from db.json (3 properties)
2. **LocationPage**: Uses location data from db.json  
3. **InboxPage**: Uses hardcoded messages (can be connected to db.json messages later)
4. **InsightsPage**: Uses hardcoded insights (can be connected to db.json insights later)
5. **DraftPage**: Uses hardcoded drafts (can be connected to db.json drafts later)

### Navigation Testing
- All bottom navigation tabs should work
- Back buttons should navigate properly
- Header icons should be functional

### Map Component Testing
- Map should render on HomePage for non-Draft filters
- Map should be toggleable in Draft view with "View Map" button
- Map tabs (Map/Land Use) should switch properly

### Data Integrity
- All data comes from centralized db.json
- No hardcoded property data in components (except pages not yet connected)
- Filtering logic works with database flags (isNew, isVerified, isDraft)

## Adding New Data

To add new properties, simply edit `db.json` and add objects to the `properties` array with the required schema. The application will automatically pick up the changes on next load.

### Sample Property Object
```json
{
  "id": "PRP-2025-NEW",
  "type": "Survey", 
  "description": "New property description",
  "address": "New Address, Guntur, Andhra Pradesh",
  "dueDate": "2025-10-30",
  "status": "High",
  "phoneNumber": "+91 12345 67890",
  "area": "1,00,000 sqft",
  "propertyType": "Residential",
  "isVerified": false,
  "isDraft": false, 
  "isNew": true,
  "createdDate": "2025-10-13"
}
```