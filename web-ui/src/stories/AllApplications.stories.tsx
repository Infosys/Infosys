import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';

import { ApplicationCard } from '../app/features/service-manager-app-features/all-applications/components/ApplicationCard';
import { pageContainer, headerSection, titleText, subtitleText, applicationsContainer, loadingContainer, filterRow, filterDropdown, searchField, sortDropdown } from '../app/features/service-manager-app-features/all-applications/styles/AllApplicationStyle';
import { JurisdictionDropdown } from '../app/components/JurisdictionDropdown/JurisdictionDropdown';
import { jurisdictionDropdownStyles } from '../app/styles/HomePageStyle/HomePageStyle';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { AllApplicationModel } from '../app/features/service-manager-app-features/all-applications/models/PropertyApplicationModel';

const mockApplications: AllApplicationModel[] = [
  {
    ID: 'APP-101',
    ApplicationNo: 'APP-101',
    PropertyID: 'P-101',
    Priority: 'High',
    TenantID: 'T1',
    DueDate: new Date().toISOString(),
    AssignedAgent: null,
    Status: 'NEW_CONSTRUCTION',
    WorkflowInstanceID: 'WF-101',
    AppliedBy: 'Ramesh',
    AssesseeID: null,
    Property: {
      ID: 'P-101',
      PropertyNo: '101',
      OwnershipType: 'Private',
      PropertyType: 'Residential',
      ComplexName: '101 MG Road',
      Address: {
        ID: 'ADDR-101',
        Locality: 'Central',
        ZoneNo: 'Zone-03',
        WardNo: 'Ward-1',
        BlockNo: 'B-05',
        Street: 'MG Road',
        ElectionWard: 'EW-07',
        SecretariatWard: 'SW-02',
        PinCode: 560001,
        DifferentCorrespondenceAddress: false,
        PropertyID: 'P-101',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        CorrespondenceAddress1: '',
        CorrespondenceAddress2: '',
        CorrespondenceAddress3: '',
      },
      AssessmentDetails: {
        ID: 'ASSESS-101',
        ReasonOfCreation: 'New Construction',
        OccupancyCertificateNumber: 'OC-2024-101',
        OccupancyCertificateDate: '2024-01-15',
        ExtentOfSite: '1200',
        IsLandUnderneathBuilding: '1100',
        IsUnspecifiedShare: false,
        PropertyID: 'P-101',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      Amenities: {
        ID: 'AMEN-101',
        type: ['Lift', 'Parking', 'Generator'],
        Description: 'Modern amenities available',
        ExpiryDate: null,
        PropertyID: 'P-101',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      ConstructionDetails: {
        ID: 'CONST-101',
        FloorType: 'Marble',
        WallType: 'Brick',
        RoofType: 'RCC',
        WoodType: 'Teak',
        PropertyID: 'P-101',
        FloorDetails: [
          {
            ID: 'FLOOR-101-1',
            FloorNo: 1,
            Classification: 'A',
            NatureOfUsage: 'Residential',
            FirmName: 'MG Builders',
            OccupancyType: 'Owner',
            OccupancyName: 'Ramesh Kumar',
            constructionDate: '2023-12-01',
            effectiveFromDate: '2024-01-01',
            UnstructuredLand: 'No',
            LengthFt: 40,
            BreadthFt: 30,
            PlinthAreaSqFt: 1200,
            BuildingPermissionNo: 'BP-2023-101',
            FloorDetailsEntered: true,
            ConstructionDetailsID: 'CONST-101',
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
          },
        ],
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      AdditionalDetails: {
        ID: 'ADD-101',
        FieldName: 'DocumentInfo',
        fieldValue: {
          DocumentType: 1,
          revenueDocumentNo: 12345,
          serialNo: 67890,
        },
        PropertyID: 'P-101',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      GISData: {
        ID: 'GIS-101',
        Source: 'GPS',
        Type: 'POLYGON',
        EntityType: 'Property',
        PropertyID: 'P-101',
        Latitude: 12.9716,
        Longitude: 77.5946,
        Coordinates: [
          {
            ID: 'COORD-101-1',
            Latitude: 12.9716,
            Longitude: 77.5946,
            GISDataID: 'GIS-101',
            CreatedAt: new Date().toISOString(),
          },
          {
            ID: 'COORD-101-2',
            Latitude: 12.9720,
            Longitude: 77.5950,
            GISDataID: 'GIS-101',
            CreatedAt: new Date().toISOString(),
          },
          {
            ID: 'COORD-101-3',
            Latitude: 12.9715,
            Longitude: 77.5955,
            GISDataID: 'GIS-101',
            CreatedAt: new Date().toISOString(),
          },
          {
            ID: 'COORD-101-4',
            Latitude: 12.9710,
            Longitude: 77.5948,
            GISDataID: 'GIS-101',
            CreatedAt: new Date().toISOString(),
          },
        ],
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      Documents: [
        {
          ID: 'DOC-101',
          PropertyID: 'P-101',
          DocumentType: 'Ownership Proof',
          DocumentName: 'sale_deed.pdf',
          FileStoreID: 'FS-101',
          UploadDate: new Date().toISOString(),
          action: 'APPROVED',
        },
      ],
      IGRS: {
        id: 'IGRS-101',
        habitation: 'MG Road Area',
        igrsWard: 'Ward-1',
        igrsLocality: 'Central',
        igrsBlock: 'B-05',
        doorNoFrom: '101',
        doorNoTo: '105',
        igrsClassification: 'A',
        builtUpAreaPct: 75,
        frontSetback: 10,
        rearSetback: 8,
        sideSetback: 5,
        totalPlinthArea: 1200,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        PropertyID: 'P-101',
      },
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    ApplicationLogs: [],
    IsDraft: false,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    AgentName: 'John Doe',
    AgentUsername: 'john.doe',
  },
  {
    ID: 'APP-102',
    ApplicationNo: 'APP-102',
    PropertyID: 'P-102',
    Priority: 'Low',
    TenantID: 'T1',
    DueDate: new Date().toISOString(),
    AssignedAgent: 'AGENT-202',
    Status: 'NEW_PROPERTY',
    WorkflowInstanceID: 'WF-102',
    AppliedBy: 'Sita',
    AssesseeID: 'ASS-102',
    Property: {
      ID: 'P-102',
      PropertyNo: '102',
      OwnershipType: 'Private',
      PropertyType: 'Residential',
      ComplexName: '102 Park Avenue',
      Address: {
        ID: 'ADDR-102',
        Locality: 'North',
        ZoneNo: 'Zone-01',
        WardNo: 'Ward-2',
        BlockNo: 'B-10',
        Street: 'Park Ave',
        ElectionWard: 'EW-03',
        SecretariatWard: 'SW-05',
        PinCode: 560002,
        DifferentCorrespondenceAddress: false,
        PropertyID: 'P-102',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        CorrespondenceAddress1: '',
        CorrespondenceAddress2: '',
        CorrespondenceAddress3: '',
      },
      AssessmentDetails: {
        ID: 'ASSESS-102',
        ReasonOfCreation: 'Renovation',
        OccupancyCertificateNumber: 'OC-2024-102',
        OccupancyCertificateDate: '2024-02-20',
        ExtentOfSite: '800',
        IsLandUnderneathBuilding: '750',
        IsUnspecifiedShare: false,
        PropertyID: 'P-102',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      Amenities: {
        ID: 'AMEN-102',
        type: ['Parking'],
        Description: 'Basic parking facility',
        ExpiryDate: null,
        PropertyID: 'P-102',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      ConstructionDetails: {
        ID: 'CONST-102',
        FloorType: 'Tiles',
        WallType: 'Concrete',
        RoofType: 'RCC',
        WoodType: 'Pine',
        PropertyID: 'P-102',
        FloorDetails: [],
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      AdditionalDetails: {
        ID: 'ADD-102',
        FieldName: 'ParkingInfo',
        fieldValue: {
          covered: true,
          spaces: 2,
          type: 'Indoor',
        },
        PropertyID: 'P-102',
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      GISData: {
        ID: 'GIS-102',
        Source: 'Manual',
        Type: 'POINT',
        EntityType: 'Property',
        PropertyID: 'P-102',
        Latitude: 13.0827,
        Longitude: 80.2707,
        Coordinates: [
          {
            ID: 'COORD-102-1',
            Latitude: 13.0827,
            Longitude: 80.2707,
            GISDataID: 'GIS-102',
            CreatedAt: new Date().toISOString(),
          },
        ],
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
      },
      Documents: [],
      IGRS: {
        id: 'IGRS-102',
        habitation: 'Park Avenue Colony',
        igrsWard: 'Ward-2',
        igrsLocality: 'North',
        igrsBlock: 'B-10',
        doorNoFrom: '102',
        doorNoTo: '108',
        igrsClassification: 'B',
        builtUpAreaPct: 60,
        frontSetback: 8,
        rearSetback: 6,
        sideSetback: 4,
        totalPlinthArea: 800,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        PropertyID: 'P-102',
      },
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
    },
    ApplicationLogs: [],
    IsDraft: false,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    AgentName: 'Jane Smith',
    AgentUsername: 'jane.smith',
  },
];

const AllApplicationsStory: React.FC<{ apps?: AllApplicationModel[]; loading?: boolean; error?: string | null }> = ({ apps = mockApplications, loading = false, error = null }) => {
  if (loading) return (
    <Box sx={loadingContainer}>
      <CircularProgress size={60} sx={{ color: '#C84C0E' }} />
    </Box>
  );

  if (error) return (
    <Container maxWidth={false} sx={pageContainer}>
      <Typography color="error">{error}</Typography>
    </Container>
  );

  return (
    <Container maxWidth={false} sx={pageContainer}>
      <Box sx={jurisdictionDropdownStyles}>
        <JurisdictionDropdown backgroundColor="#F7E4DB" hoverBackgroundColor="#F0DED1" />
      </Box>
      <Box sx={headerSection}>
        <Typography variant="h4" sx={titleText}>All Applications</Typography>
        <Typography variant="subtitle1" sx={subtitleText}>Manage properties under enumeration and verification</Typography>
      </Box>

      {/* Filter Row */}
      <Box sx={filterRow}>
        <FormControl sx={filterDropdown}>
          <Select
            value={"Application No."}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              bgcolor: '#D4E4E8',
              borderRadius: '24px',
              height: '48px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            <MenuItem value="Application No.">Application No.</MenuItem>
            <MenuItem value="Address">Address</MenuItem>
            <MenuItem value="Ward">Ward</MenuItem>
            <MenuItem value="Zone">Zone</MenuItem>
            <MenuItem value="Due Date">Due Date</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Search Application"
          sx={searchField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={sortDropdown}>
          <Select
            value={"New - Old"}
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              borderRadius: '24px',
              height: '48px',
              border: '1px solid #C84C0E',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              fontFamily: 'Roboto, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#333',
            }}
          >
            <MenuItem value="New - Old">New - Old</MenuItem>
            <MenuItem value="Old - New">Old - New</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={applicationsContainer}>
        {(!apps || apps.length === 0) ? (
          <Typography sx={{ color: 'text.secondary' }}>No applications found</Typography>
        ) : (
          apps.map(a => <ApplicationCard key={a.ID} application={a} />)
        )}
      </Box>
    </Container>
  );
};

const meta: Meta<typeof AllApplicationsStory> = {
  title: 'Pages/AllApplications',
  component: AllApplicationsStory,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <Box sx={{ p: 3, backgroundColor: '#f6f7f8', minHeight: '100vh' }}>
            <Story />
          </Box>
        </MemoryRouter>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AllApplicationsStory>;

export const Default: Story = { render: () => <AllApplicationsStory /> };
export const Loading: Story = { render: () => <AllApplicationsStory loading /> };
export const Empty: Story = { render: () => <AllApplicationsStory apps={[]} /> };
export const Error: Story = { render: () => <AllApplicationsStory error={'Failed to load applications'} /> };
