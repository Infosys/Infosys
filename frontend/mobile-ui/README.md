# 🏠 Property Tax Frontend - Complete Documentation

A comprehensive, mobile-first React + TypeScript application for property tax management in DIGIT 3.0. This frontend enables both **Agents** and **Citizens** to submit, verify, and manage property tax applications, upload documents, track enumeration progress, and communicate with stakeholders. The UI is optimized for usability, accessibility, localization, and seamless backend integration.

---

## 📑 Table of Contents

- 🛠️ Tech Stack
- 📋 Prerequisites
- 📥 Installation
- 🚀 Running the Project
- 🗂️ Project Structure
- 📜 Available Scripts
- 🎨 Styling & UI
- 🌐 Localization System
- 🔗 API Integration
- 👨‍💼 Agent Module
- 👤 Citizen Module
- 📝 Property Form Flow
- 🗄️ Data Management
- 🧪 Testing
- 🐳 Docker Deployment
- 🤝 Contributing
- 📄 License

---

## 🛠️ Tech Stack

- **⚛️ Framework:** React 19 with TypeScript
- **🗂️ State Management:** Redux Toolkit (RTK Query for API calls)
- **🎨 UI Library:** Material-UI (MUI) v6
- **🧭 Routing:** React Router v7
- **💅 Styling:** CSS Modules, custom CSS, MUI theming
- **🌐 Localization:** Custom context-based localization with backend API integration
- **⚡ Build Tool:** Vite 6
- **🧪 Testing:** Vitest, React Testing Library
- **🗄️ API Mocking:** json-server
- **📦 Package Manager:** npm
- **🐳 Containerization:** Docker with Nginx

---

## 📋 Prerequisites

- **🟢 Node.js:** v18.x or higher
- **📦 npm:** v9.x or higher
- **🐳 Docker:** (optional, for containerized deployment)

---

## 📥 Installation

```bash
# Clone the repository
git clone < github repo url 
cd property-tax-frontend

# Install dependencies
npm install
```

---

## 🚀 Running the Project

### 🛠️ Development Mode

```bash
npm run dev
```
- Starts Vite dev server at `http://localhost:5173`
- by default server will run on 5173 but we can change it as per requirement.
- Hot module replacement enabled
- Auto-opens browser

### 🏗️ Build for Production

```bash
npm run build
```
- Outputs optimized bundle to `dist`
- TypeScript compilation and tree-shaking

### 👀 Preview Production Build

```bash
npm run preview
```
- Serves production build locally for testing

### 🗄️ Mock API Server

```bash
npm run server
```
- Starts json-server at `http://localhost:4000`
- Serves mock data from `json-server` folder

---

## 🗂️ Project Structure

```
property-tax-frontend/
├── public/                          # Static assets
│   └── manifest.json               # PWA manifest
├── src/
│   ├── App.tsx                     # Main app component with route config
│   ├── main.tsx                    # React entry point
│   ├── Providers.tsx               # Global providers wrapper
│   ├── store.ts                    # Redux store configuration
│   │
│   ├── app/
│   │   ├── components/             # Shared components
│   │   │   ├── BottomBar.tsx      # Citizen bottom navigation
│   │   │   ├── NavBar.tsx         # Citizen top navigation
│   │   │   ├── NavHeader.tsx      # Agent navigation header
│   │   │   ├── Header.tsx         # Page header component
│   │   │   ├── Loader.tsx         # Loading spinner
│   │   │   ├── SupportCard.tsx    # Help/support card
│   │   │   └── Popup/             # Notification & locale popups
│   │   │
│   │   ├── features/              # Feature modules
│   │   │   ├── Agent/             # Agent-specific features
│   │   │   │   ├── api/          # Agent API calls (RTK Query)
│   │   │   │   ├── components/   # Agent UI components
│   │   │   │   └── models/       # Agent data models
│   │   │   │
│   │   │   └── Citizen/           # Citizen-specific features
│   │   │       ├── api/          # Citizen API calls
│   │   │       │   ├── CitizenHomePageApi/
│   │   │       │   ├── CitizenPropertiesPageApi/
│   │   │       │   └── CitizenDocumentPageApi/
│   │   │       ├── components/   # Citizen UI components
│   │   │       │   ├── ui/      # Tab components (Overview, Documents, etc.)
│   │   │       │   ├── PropertyCard.tsx
│   │   │       │   ├── MapView.tsx
│   │   │       │   └── PropertyList.tsx
│   │   │       └── models/       # Citizen data models
│   │   │
│   │   ├── pages/                 # Page-level components
│   │   │   ├── Agent/            # Agent pages
│   │   │   │   ├── HomePage.tsx
│   │   │   │   ├── ReviewedProperties.tsx
│   │   │   │   ├── PropertyFormVerification.tsx
│   │   │   │   ├── PropertyInformationSubmitted.tsx
│   │   │   │   └── AddRequestOrComment.tsx
│   │   │   │
│   │   │   ├── Citizen/          # Citizen pages
│   │   │   │   ├── CitizenHomePage.tsx
│   │   │   │   ├── Properties.tsx
│   │   │   │   └── PropertyDetails.tsx
│   │   │   │
│   │   │   ├── PropertyForm/     # Multi-step property form
│   │   │   │   ├── PreliminaryInfo.tsx
│   │   │   │   ├── PropertyInformation.tsx
│   │   │   │   ├── LocationSelection.tsx
│   │   │   │   ├── IGRSAdditionalDetailsPage.tsx
│   │   │   │   ├── AssessmentDetails.tsx
│   │   │   │   ├── ConstructionDetailsPage.tsx
│   │   │   │   ├── FloorDetailsPage.tsx
│   │   │   │   ├── OwnerDetails.tsx
│   │   │   │   ├── DocumentsInformation.tsx
│   │   │   │   ├── DocumentUpload.tsx
│   │   │   │   ├── PropertySummary.tsx
│   │   │   │   ├── ApplicationLog.tsx
│   │   │   │   └── DraftPage.tsx
│   │   │   │
│   │   │   ├── Common/           # Shared pages
│   │   │   │   ├── LandingPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   └── LanguageSelectionPage.tsx
│   │   │   │
│   │   │   └── UnderConstruction.tsx
│   │   │
│   │   ├── routes/                # Route configurations
│   │   │   ├── AgentRoutes.tsx
│   │   │   ├── CitizenRoutes.tsx
│   │   │   ├── FormRoutes.tsx
│   │   │   └── CommonRoutes.tsx
│   │   │
│   │   └── assets/                # Images, icons, SVGs
│   │       ├── Agent/
│   │       └── Citizen/
│   │
│   ├── components/                # Additional shared components
│   │   └── Popup/
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthProvider.tsx      # Authentication context
│   │   ├── LanguageContext.tsx   # Language selection
│   │   └── PropertyFormContext.tsx
│   │
│   ├── redux/                     # Redux store and slices
│   │   ├── apis/                 # RTK Query API definitions
│   │   │   ├── applicationApi.ts
│   │   │   └── authenticationApi.ts
│   │   ├── Hooks.ts              # Typed Redux hooks
│   │   └── slices/               # Redux slices
│   │       └── languageSlice.ts
│   │
│   ├── services/                  # Business logic and API services
│   │   ├── AgentLocalisation/    # Agent localization hooks
│   │   │   ├── formLocalisation.ts
│   │   │   ├── localisation-homepage.ts
│   │   │   ├── localisation-documents.ts
│   │   │   ├── localisation-documentupload.ts
│   │   │   ├── localisation-propertysummary.ts
│   │   │   └── ...
│   │   │
│   │   ├── Citizen/              # Citizen services
│   │   │   └── Localization/
│   │   │       └── LocalizationContext.tsx
│   │   │
│   │   ├── dataService.ts        # Data fetching utilities
│   │   ├── jsonServerApiCalls.ts # Mock API calls
│   │   └── AuthService.ts        # Authentication service
│   │
│   ├── storage/                   # Local storage utilities
│   │   └── storageService.ts     # Documents, photos, drafts storage
│   │
│   ├── localization/             # Localization utilities
│   │   └── localize.ts          # Flatten/unflatten localization data
│   │
│   ├── styles/                    # Global CSS files
│   │   ├── globals.css
│   │   ├── HomePage.css
│   │   ├── PropertySummary.css
│   │   ├── FloorDetailsPage.css
│   │   └── ...
│   │
│   ├── validations/              # Form validation logic
│   │
│   └── vite-env.d.ts            # Vite TypeScript definitions
│
├── json-server/                   # Mock backend data
│   ├── db.json                   # Main mock database
│   └── propertyApplications.json
│
├── docs/                          # Documentation
│   └── db-data-usage.md          # API data mapping
│
├── .env.example                   # Environment variables template
├── .env.dev                      # Environment variables for dev environment
├── .env.prod                     # Environment variables for prod environment
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Vitest setup file
├── tsconfig.json                 # TypeScript config
├── Dockerfile                    # Docker container config
├── nginx.conf                    # Nginx server config
├── package.json                  # Dependencies and scripts
├── DATA_MANAGEMENT.md            # Data filtering documentation
├── TESTING_CHECKLIST.md          # Testing guide
└── README.md                     # This file
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | 🛠️ Start development server at `http://localhost:5173` |
| `npm run build` | 🏗️ Build production bundle to `dist` |
| `npm run preview` | 👀 Preview production build locally |
| `npm run lint` | 🧹 Run ESLint on codebase |
| `npm run server` | 🗄️ Start json-server mock API at `http://localhost:3000` |
| `npm test` | 🧪 Run Vitest tests |

---

## 🎨 Styling & UI

### Design System

- **Primary Color:** `#C84C0E` (Orange) - Used for CTAs, highlights
- **Background:** `#F5F5F5` (Light gray) - Main background
- **Cards:** `#FFFFFF` with subtle shadows
- **Typography:** Roboto font family
- **Spacing:** Consistent 8px base unit

### Styling Approach

1. **Material-UI Components:** Pre-built, customizable components
2. **CSS Modules:** Component-scoped styles
3. **Global Styles:** `src/styles/globals.css` and `src/index.css`
4. **Responsive Design:** Mobile-first approach (max-width: 412px for mobile)

### Key Style Files

- `src/styles/HomePage.css` - Agent/Citizen home page styles
- `src/styles/PropertySummary.css` - Summary page layout
- `src/styles/FloorDetailsPage.css` - Floor form styles
- `src/styles/Layout.css` - Responsive layout utilities

---

## 🌐 Localization System

### Overview

The app supports **3 languages**:
- 🇬🇧 **English** (`en`)
- 🇮🇳 **Kannada** (`kn`)
- 🇮🇳 **Hindi** (`hi`)

### How It Works

1. **Backend API Integration:**
   - Fetches localized messages from `VITE_LOCALIZATION_HOST` API
   - Format: `/localization/v1/messages?module=common&locale={locale}&codes={codes}`
   - Uses `X-Tenant-ID: pg` header

2. **Context-Based Storage:**
   - Messages stored in `sessionStorage` per module (AGENT/CITIZEN)
   - Retrieved via `getMessagesFromSession(role)`

3. **Custom Hooks:**
   - **Agent:** `useHomePageLocalization()`, `useDocumentsLocalization()`, etc.
   - **Citizen:** `useLocalization()` from `src/services/Citizen/Localization/LocalizationContext.tsx`

4. **Fallback Mechanism:**
   - Hardcoded fallback translations if API fails
   - Graceful degradation to English

### Usage Example

```tsx
import { getMessagesFromSession, useLocalization } from '../services/Citizen/Localization/LocalizationContext';

const MyComponent = () => {
  const lang = useAppSelector(state => state.lang.citizenLang);
  const { loading } = useLocalization();
  const messages = getMessagesFromSession("CITIZEN")!;

  if (loading) return <LoadingPage />;

  return (
    <Typography>
      {messages['citizen.commons'][lang]['welcome-message']}
    </Typography>
  );
};
```

### Localization Files

- Agent: `src/services/AgentLocalisation`
- Citizen: `src/services/Citizen/Localization`

---

## 🔗 API Integration

### Architecture

- **RTK Query:** Type-safe API calls with automatic caching
- **Base Query:** Configured in `src/app/service/BaseQuery.api.ts`
- **Authentication:** Bearer token from `authService.getValidToken()`
- **Headers:** `X-Tenant-ID`, `X-User-ID`, `Authorization`

### API Endpoints

| Endpoint | Description | File |
|----------|-------------|------|
| `/property-tax-services/v1/applications` | Create/update applications | `src/redux/apis/applicationApi.ts` |
| `/property-tax-services/v1/citizen/applications` | Citizen property list | `src/app/features/Citizen/api/CitizenHomePageApi/CitizenHomePageApi.ts` |
| `/property-tax-services/v1/citizen/properties/{id}` | Property details | `src/app/features/Citizen/api/CitizenPropertiesPageApi/CitizenPropertyPageApi.ts` |
| `/filestore/v1/files` | Upload documents | `src/redux/apis/applicationApi.ts` |
| `/filestore/v1/files/id` | Download file blob | `src/app/features/Citizen/api/CitizenDocumentPageApi/fileStoreApi.ts` |

### Environment Variables

```env
VITE_ENUMERATION_HOST =
VITE_TENANT_ID = 

VITE_LOCALIZATION_HOST=
VITE_FILESTORE_HOST = 
VITE_ONBOARDING_HOST = 
VITE_MDMS_HOST=

VITE_KEYCLOAK_URL = 
VITE_KEYCLOAK_REALM = 
VITE_KEYCLOAK_CLIENT_ID = 
VITE_KEYCLOAK_CLIENT_SECRET = 
VITE_KEYCLOAK_SCOPE = 
```

### Mock API (Development)

- **Server:** json-server
- **Port:** 3000
- **Data:** `json-server/db.json`
- **Documentation:** `docs/db-data-usage.md`

---

## 👨‍💼 Agent Module

### Overview

Agents are field workers who enumerate properties, verify applications, and communicate with the service manager. The agent workflow is optimized for mobile use with map-based property management.

### Key Features

- 🗺️ **Map/Land Use Toggle:** View properties on map or land use zoning
- ➕ **Add New Property:** Multi-step form for property enumeration
- ✅ **Verification Workflow:** Review and verify property applications
- 📧 **Internal Communication:** Email service manager
- 📜 **Application Log:** Timeline of comments and document uploads
- 🔍 **Search:** Find properties by owner, location, or phone

### Agent Pages

#### 1️⃣ HomePage (`src/app/pages/Agent/HomePage.tsx`)

**Path:** `/agent/home`

**Features:**
- 🗺️ Map view with property markers
- 📑 Tabs: All | New | Reviewed | Drafts
- ➕ Add New Property button
- 📄 Generate No Dues certificate
- 🏷️ Property list with status indicators

**Navigation:**
- Click property → Property Form Verification
- Click ✅ icon → Reviewed Properties
- Bottom nav → Inbox, Notifications, Search

#### 2️⃣ PropertyFormVerification (`src/app/pages/Agent/PropertyFormVerification.tsx`)

**Path:** `/agent/property-verification/:id`

**Features:**
- 📍 Map location and address
- ⚠️ Summary of required/verification fields
- ➡️ Continue to Form button
- ✉️ Send Email to Service Manager
- 📜 Application Log button
- ➕ Add Comment/Request

**Sections:**
- Property Details
- Property Measurements
- Property Classification
- Property Features
- Property Structure
- Floor-wise Usage

#### 3️⃣ ReviewedProperties

**Path:** `/agent/reviewed-properties`

**Features:**
- 🔍 Search by location
- 📅 Filter by date range
- ✅ Verified status badges
- 📄 Property cards with details

**Navigation:**
- Click property → Form Summary

#### 4️⃣ PropertyInformationSubmitted (`src/app/pages/Agent/PropertyInformationSubmitted.tsx`)

**Path:** `/agent/property-submitted/:id`

**Features:**
- 📊 Comprehensive property summary
- 🗺️ Map integration (Google, Apple, OpenStreet)
- 📑 Document thumbnails
- 🏠 Owner and assessment details

#### 5️⃣ Search Property

**Path:** `/agent/search`

**Features:**
- 📝 Search fields: Owner name, Location, Phone
- 🎙️ Voice input support
- 📄 Results with status indicators

#### 6️⃣ ApplicationLog (`src/app/pages/PropertyForm/ApplicationLog.tsx`)

**Path:** `/property-form/application-log/:id`

**Features:**
- ⏳ Timeline view of events
- 📥 Download attached documents
- ➕ Add new request/comment button

#### 7️⃣ AddRequestOrComment (`src/app/pages/Agent/AddRequestOrComment.tsx`)

**Features:**
- 💬 Comment/request text input
- 📁 File upload support
- ✅ Submit to application log

---

## 👤 Citizen Module

### Overview

Citizens can view their properties, track enumeration progress, upload documents, and manage property applications. The interface is designed for simplicity and ease of use.

### Key Features

- 🏠 **Dashboard:** Summary cards, urgent notifications, property map/list
- 🏘️ **My Properties:** View all properties and drafts
- 📄 **Property Details:** Overview, Plot Info, History, Documents tabs
- ⬆️ **Document Upload:** Upload/view property documents
- 📊 **Enumeration Progress:** Visual progress tracking
- 🗺️ **Map Integration:** View property locations

### Citizen Pages

#### 1️⃣ CitizenHomePage (`src/app/pages/Citizen/CitizenHomePage.tsx`)

**Path:** `/citizen`

**Features:**
- 📊 **Summary Cards:**
  - Active Licenses count
  - Number of Properties
- 🚨 **Urgent Attention:** Alerts for important actions
- 🗺️/📋 **Map/List Toggle:** Switch views
- ➕ **Add New Property:** Start property application

**Components:**
- `src/app/features/Citizen/components/InfoCard.tsx` - Summary cards
- `src/app/features/Citizen/components/UrgentCard.tsx` - Alert cards
- `src/app/features/Citizen/components/ChromeTabs.tsx` - View toggle
- `src/app/features/Citizen/components/MapView.tsx` - Property map
- `src/app/features/Citizen/components/PropertyList.tsx` - List view

#### 2️⃣ Properties (`src/app/pages/Citizen/Properties.tsx`)

**Path:** `/citizen/properties`

**Features:**
- 📑 **Tabs:** Properties | Drafts
- 🏷️ **Property Cards:**
  - Address and location
  - Enumeration progress bar
  - Status badges (Enumerated/Under Enumeration)
  - Map pin with location
- 📝 **Draft Applications:** Manage incomplete applications

**API Integration:**
```tsx
const { data: propertiesData } = useGetCitizenApplicationsQuery({
  assesseeId,
  isDraft: false,
});
```

#### 3️⃣ PropertyDetails (`src/app/pages/Citizen/PropertyDetails.tsx`)

**Path:** `/citizen/property/:id`

**Features:**
- 🗂️ **4 Tabs:**
  1. **Overview** (`src/app/features/Citizen/components/ui/OverviewCard.tsx`)
     - Property type, construction year
     - Built-up area, plot area
     - Government numbers (Zone, Ward)
     - Land use & zoning details
  
  2. **Plot Info** (`src/app/features/Citizen/components/ui/PlotInfoCard.tsx`)
     - Survey number, subdivision
     - Village, district, hobli, taluk
     - Building setbacks (front, rear, side, coverage)
  
  3. **History** (`src/app/features/Citizen/components/ui/HistoryCard.tsx`)
     - Ownership history
     - Registration dates and status
     - Property type changes
  
  4. **Documents** (`src/app/features/Citizen/components/ui/DocumentsTab.tsx`)
     - **Upload Cards:** Missing documents (Sale Deed, Affidavit, etc.)
     - **Uploaded Documents:** View, download, status badges
     - **File Blob Fetching:** Lazy loading with error handling

**Document Handling:**
```tsx
// Fetch file blob
const [fetchFileBlob] = useLazyGetFileBlobQuery();

// Download document
const handleDownloadDocument = async (fileStoreId: string, fileName: string) => {
  const blob = fileBlobs[fileStoreId];
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
```

**Components:**
- `src/app/features/Citizen/components/EnumOptComponent.tsx` - Progress tracking
- `src/app/features/Citizen/components/PropertyMapSection.tsx` - Map display
- `src/app/features/Citizen/components/OverviewStack.tsx` - Summary rows

---

## 📝 Property Form Flow

The property form is a **multi-step wizard** used by both Agents and Citizens to enumerate new properties.

### Form Steps

| Step | Component | Description |
|------|-----------|-------------|
| 1️⃣ | `src/app/pages/PropertyForm/PreliminaryInfo.tsx` | Select property type (vacant land, structure, multi-structure, building unit) |
| 2️⃣ | `src/app/pages/PropertyForm/PropertyInformation.tsx` | Category, ownership, property type, apartment name |
| 3️⃣ | `LocationSelection.tsx` | Add location tag, draw polygon on map |
| 4️⃣ | `src/app/pages/PropertyForm/IGRSAdditionalDetailsPage.tsx` | IGRS details, building setbacks |
| 5️⃣ | `src/app/pages/PropertyForm/AssessmentDetails.tsx` | Assessment information |
| 6️⃣ | `src/app/pages/PropertyForm/ConstructionDetailsPage.tsx` | Construction details |
| 7️⃣ | `src/app/pages/PropertyForm/FloorDetailsPage.tsx` | Floor-wise usage, occupancy, built-up area |
| 8️⃣ | `src/app/pages/PropertyForm/OwnerDetails.tsx` | Owner information (primary + additional owners) |
| 9️⃣ | `src/app/pages/PropertyForm/DocumentsInformation.tsx` | Document metadata (type, serial number, dates) |
| 🔟 | `src/app/pages/PropertyForm/DocumentUpload.tsx` | Upload files (PDF, images) |
| 1️⃣1️⃣ | `src/app/pages/PropertyForm/PropertySummary.tsx` | Review and submit |

### Form Context

**File:** `src/context/PropertyFormContext.tsx`

**Features:**
- Centralized form state management
- Persist data across steps
- Save draft functionality
- Load existing applications

```tsx
const { formData, updateForm, mode, setMode } = usePropertyForm();
```

### Validation

Each step validates data before proceeding:

```tsx
// Example from FloorDetailsPage
const validateFloorData = (data: FloorData): Partial<Record<keyof FloorData, string>> => {
  const errors: Partial<Record<keyof FloorData, string>> = {};
  
  if (!data.floorNumber || data.floorNumber === '') {
    errors.floorNumber = `${texts.floorNumberLabel} ${isRequiredText}.`;
  }
  
  return errors;
};
```

### Draft Functionality

**Save Draft:**
```tsx
const handleSaveDraft = async () => {
  await updateApplication({
    applicationData: formData,
    isDraft: true
  });
  navigate('/agent/drafts');
};
```

**Load Draft:**
```tsx
// Drafts listed in DraftPage.tsx
const drafts = useGetDraftsQuery();
```

---

## 🗄️ Data Management

### Local Storage

**File:** `src/storage/storageService.ts`

**Functions:**
- `saveDocument(doc: DocumentItem)` - Save document metadata
- `loadDocuments()` - Retrieve all documents
- `savePhoto(photo: PhotoItem)` - Save photo metadata
- `exportDocuments()` - Export as JSON
- `importDocumentsFromObject(obj)` - Import JSON data

**Usage:**
```tsx
import { saveDocument, loadDocuments } from '../storage/storageService';

// Save
saveDocument({
  id: '1',
  name: 'Sale Deed.pdf',
  type: 'pdf',
  size: 1024000,
  uploadDate: new Date().toISOString()
});

// Load
const docs = loadDocuments();
```

### Session Storage

**Authentication:**
- User object stored in `sessionStorage`
- Retrieved via `getUserFromSession()` in `src/context/AuthProvider.tsx`

**Localization:**
- Messages cached in `sessionStorage` by module
- Key format: `localization_{ROLE}_messages`

### Data Filtering

**File:** `DATA_MANAGEMENT.md`

**Filter Types:**
- **All:** Show all properties
- **New:** Recently added/finished properties
- **Reviewed:** Verified properties
- **Draft:** Incomplete applications

**Implementation:**
```tsx
// Example from HomePage
const filteredProperties = properties.filter(p => {
  if (activeTab === 'new') return p.status === 'NEW';
  if (activeTab === 'reviewed') return p.verified === true;
  if (activeTab === 'drafts') return p.isDraft === true;
  return true; // 'all'
});
```

---

## 🧪 Testing

### Test Configuration

**Files:**
- `vitest.config.ts` - Vitest configuration
- `vitest.setup.ts` - Vitest setup file

**Setup:**
```ts
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  }
});
```

### Testing Checklist

**File:** `TESTING_CHECKLIST.md`

**Test Categories:**
1. **🏠 HomePage Filter Testing**
   - Verify filter buttons work
   - Check property counts per filter
   - Test Draft mode layout

2. **🗺️ Map Component Testing**
   - Property markers render
   - Click markers shows property info
   - Map/Land Use toggle works

3. **🔍 Search Testing**
   - Search field selection
   - Results display correctly
   - Voice input (if applicable)

4. **📊 Data Integrity**
   - API responses match expected format
   - Localization loads correctly
   - Error handling works

### Running Tests

```bash
npm test
```

---

## 🐳 Docker Deployment

### Dockerfile

**File:** `Dockerfile`

**Build:**
```bash
docker build -t < image name > .
```

**Run:**
```bash
docker run -p 80:80 < image name >
```

### Nginx Configuration

**File:** `nginx.conf`

**Features:**
- Serves static files from `/usr/share/nginx/html`
- SPA routing fallback (`try_files $uri /index.html`)
- Gzip compression
- MIME types from `mime.types`

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- **Linting:** ESLint (run `npm run lint`)
- **Formatting:** Prettier (config in `.prettierrc`)
- **TypeScript:** Strict mode enabled

### File Header Comments

Add descriptive comments to new files:
```tsx
// ComponentName.tsx
// Brief description of the component's purpose and responsibilities.
// Main features:
// - Feature 1
// - Feature 2
```

---

## 📄 License

**File:** `LICENSE`

MIT License - See LICENSE file for details.

---

## 📚 Additional Documentation

- **API Data Mapping:** `docs/db-data-usage.md`
- **Data Management:** `DATA_MANAGEMENT.md`
- **Testing Guide:** `TESTING_CHECKLIST.md`

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| **Frontend** | `http://localhost:5173` |
| **Mock API** | `http://localhost:3000` |
| **GitHub** | [Repository URL] |
| **Documentation** | This README |


**🎉 Thank you for using the Property Tax Frontend!**

This documentation provides a comprehensive guide to understanding and working with the codebase. For specific implementation details, refer to the inline code comments and TypeScript definitions throughout the project.
