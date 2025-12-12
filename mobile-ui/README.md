

# 🏠 Property Tax Frontend


A modern, mobile-first React + TypeScript application for property tax management. This frontend provides agents and citizens with workflows to submit, verify, and manage property tax forms, upload documents, and track application status. The UI is optimized for usability, accessibility, and seamless integration with backend APIs.



## 🛠️ Tech Stack


- **⚛️ Framework:** React 19 (with TypeScript)
- **🗂️ State Management:** Redux Toolkit (RTK Query)
- **🎨 UI Library:** Material-UI (MUI)
- **🧭 Routing:** React Router v7
- **💅 Styling:** CSS Modules, custom CSS, MUI theming
- **🌐 Localization:** Custom context-based localization
- **⚡ Build Tool:** Vite
- **🧪 Testing:** Vitest, React Testing Library
- **🗄️ API Mocking:** json-server
- **📦 Package Manager:** npm

---


## 📋 Prerequisites


- **🟢 Node.js:** v18.x or higher recommended
- **📦 npm:** v9.x or higher (comes with Node.js)
- No global dependencies required

---


## 📥 Installation

1. **🔗 Clone the repository:**
   ```sh
   git clone https://github.com/your-org/property-tax-frontend.git
   cd property-tax-frontend
   ```

2. **📦 Install dependencies:**
   ```sh
   npm install
   ```



---


## 🚀 Running the Project


### 🛠️ Development mode

```sh
npm run dev
```
- Starts the Vite development server at http://localhost:5174.


### 🏗️ Build for production

```sh
npm run build
```
- Builds the app for production (output in `dist/`).


### 👀 Preview production build

```sh
npm run preview
```
- Serves the production build locally for testing.

---


## 🗂️ Project Structure

```
src/
├── App.tsx                # Main app component and route definitions
├── app/                   # Feature modules, pages, and services
├── assets/                # Images, icons, and static assets
├── components/            # Shared and agent-specific components
├── config/                # App configuration (env, theme, httpClient)
├── context/               # React context providers
├── hooks/                 # Custom React hooks
├── localization/          # Localization utilities
├── models/                # Data models and types
├── pages/                 # Page-level components
├── redux/                 # Redux slices, store, and API logic
├── services/              # API and business logic services
├── storage/               # Local storage helpers
├── styles/                # CSS styles
├── types/                 # TypeScript types
├── validations/           # Validation logic
public/                    # Static assets and manifest
json-server/               # Mock backend data for development/testing
docs/                      # Documentation
```

---


## 📜 Scripts


- `npm run dev` → ⚡ Start dev server
- `npm run build` → 🏗️ Build production bundle
- `npm run preview` → 👀 Preview production build
- `npm run lint` → 🧹 Run linter

---


## 🎨 Styling & UI

- **CSS Methodology:** Uses CSS Modules for component-scoped styles, along with custom CSS files for global and utility styles.
- **UI Library & Theming:** Material-UI (MUI) is used for consistent design and theming, with theme configuration in `src/config/theme.ts`.
- **Organization:**
   - Component-specific styles are placed alongside their components.
   - Global styles and resets are in `src/styles/` and `src/index.css`.
   - Asset-specific styles (icons, images) are organized under `src/assets/`.
   - Supports responsive layouts and dark/light theme customization.

---


## 🔗 API Integration

- **API Layer:** All backend interactions are organized by feature in `src/app/features/`:
   - `src/app/features/Agent/api/` – Agent-specific API calls
   - `src/app/features/Citizen/api/` – Citizen-specific API calls
   - `src/app/features/PropertyForm/api/` – Property form API calls
   Each feature's `api` folder contains logic for interacting with backend services, typically using RTK Query.
- **Mock API:** Use `json-server` for local development and testing.
- **Example endpoint:**
   - `GET /propertyApplications` (mocked via `json-server/propertyApplications.json`)




## 👨‍🔧 Agent Module in DIGIT 3.0

The Agent module in DIGIT 3.0 is designed to assist field agents in managing property tax-related tasks efficiently. Agents can add new properties, verify property details, review applications, and communicate with other stakeholders. The user interface is optimized for mobile and field use, providing map-based property management and streamlined workflows.



## ⭐ Features of Each Page

### 👤 Profile Page
- **🔓 Access:** Click the Profile icon at the top right of the Home page.
- **📝 Personal Details:**
  - Agent name and verification status (e.g., ✅ Verified Agent)
  - 📧 Email address and 📱 phone number
  - 🗺️ Assigned jurisdictions/wards
- **🔔 Notification Settings:**
  - Toggle application updates (receive updates on new or updated applications)
  - Toggle appointment scheduling notifications (for rescheduling and scheduling appointments)
  - Select delivery methods for notifications:
    - 📩 SMS Notifications
    - 🟢 WhatsApp Notifications
    - 📧 Email Notifications
- **🚪 Log Out:** Securely log out of the application from the profile page
- **⬅️ Navigation:** Use the Previous button to return to the previous screen

### 🌍 Language Selection
- **🔓 Access:** Click the Language icon beside the Profile icon on the Home page.
- **🌐 Functionality:** Allows the agent to select the preferred language from the list of languages assigned to them.
- **✨ Dynamic Language Support:** The interface updates to reflect the selected language for a personalized experience.

### 🏠 Home Page
- **🗺️ Jurisdiction Display:** Shows the agent's assigned wards.
- **🌐 & 👤 Language & Profile:** Quick access to language selection and profile management.
- **🆔 & 🆘 Agent ID & Help:** Access agent credentials and help resources.
- **🗺️/🗾 Map/Land Use Toggle:** Switch between property map and land use zoning view.
- **➕ Add New Property:** Start a new property application.
- **📄 Generate No Dues:** Generate a no-dues certificate for a property.
- **📑 Tabs (All/New/Drafts/Others):** Filter properties by status.
- **🏷️ Property List:** View properties with status, category, address, and date. Click to view or edit.
- **▶️ Pagination:** Navigate through multiple pages of property records.
- **🔽 Bottom Navigation:** Quick access to Home, Inbox, Notifications, and Search.

### 📝 Property Form Verification Page
- **🗺️ & 🏠 Map & Address:** Visualize property location and details.
- **⚠️ Summary of Required/Review Fields:** Highlights missing or unverified fields.
- **➡️ Continue to Form:** Proceed to complete or verify property details.
- **✉️ Send Email:** Internal correspondence with Service Manager.
- **📜 Application Log:** View property application history and comments.
- **➕ Add Comment/Request:** Submit comments or upload documents.

### 📋 Reviewed Properties Page
- **🔍 Search & Filter:** Search reviewed properties by location and filter by date.
- **✅ Verified Status:** See which properties are verified.
- **🗂️ Property List:** View details and navigate to Form Summary.
- **▶️ Pagination:** Navigate through reviewed properties.

### 🗃️ Form Summary Page
- **📄 Property Details:** View all submitted property information.
- **🗺️ IGSR Details:** Survey, GIS, cadastral, and registration info.
- **👤 Owner & Assessment Details:** Owner contact, usage, construction, tax zone, etc.
- **📑 Documents Uploaded:** List and download supporting documents.
- **🗺️ Map Integration:** View property on Google Maps, Apple Maps, or Open Street Maps.

### 🔍 Search Property Page
- **📝 Field Selection:** Search by owner name, location, or phone number.
- **🎙️ Voice Input:** Option to use voice for search fields.
- **📄 Search Results:** List of properties with status and location.
- **🌏 View Location:** Directly view property location on map.

### 🕒 Application Log
- **⏳ Timeline View:** Chronological history of application events and comments.
- **🔁 Status Updates:** See inspection, verification, and admin actions.
- **⬇️ Document Download:** Download attached documents.
- **✍️ Add Request:** Add new requests or comments.

### 💬 Add Comment or Request
- **💭 Comment/Request Input:** Enter comments or requests for the application log.
- **📁 File Upload:** Attach supporting documents (PDF, images, etc.).
- **✅/❌ Submit/Cancel:** Submit or cancel the comment/request.

### 📧 Send Email
- **✍️ Compose Email:** Internal communication with Service Manager.
- **📎 Attachment Support:** Attach documents to emails.
- **💾/🗑️ Draft/Discard:** Save as draft or discard the email.

## 🧭 Agent Workflow and Navigation

### 1️⃣ Home Page
- **🗺️ Map Section:**
  - Two views: **Map** (shows properties on a map) and **Land Use** (shows land use zoning).
- **🚀 Action Buttons:**
  - **➕ Add New Property:** Start a new property application.
  - **📄 Generate No Dues:** Generate a no-dues certificate for a property.
  - **📑 Tabs:**
    - **All:** View all properties assigned to the agent.
    - **New:** View newly assigned or finished properties.
    - **Drafts:** View properties with incomplete applications.
    - **Others:** Other property categories.
- **🏷️ Property List:**
  - Shows properties with status (🔴 High/🟡 Medium), category ID, address, and date.
  - Clicking a property navigates to the **Property Form Verification** page.

### 2️⃣ Property Form Verification Page
- **📃 Summary of Property:**
  - Map location, address, and property details.
  - Shows missing required fields and fields needing verification.
- **🔔 Actions:**
  - **➡️ Continue to Form:** Proceed to complete or verify property details.
  - **✉️ Send Email:** Internal correspondence with the Service Manager.
  - **📜 Application Log:** View the history of comments and requests for the property.
  - **➕ Add Comment/Request:** Submit comments or upload documents for the application log.

### 3️⃣ Reviewed Properties Page
- Accessed by clicking the ✅ tick button on the Home page.
- Shows a list of properties that have been reviewed and verified.
- Clicking a property navigates to the **Form Summary** page.

### 4️⃣ Form Summary Page
- Displays detailed information about the submitted property, including:
  - 🏠 Property details (type, zone, door number, area)
  - 🗺️ IGSR details (survey number, GIS reference, cadastral map)
  - 👤 Owner information
  - 📑 Assessment details (usage, construction year, built-up area, tax zone)
  - 📁 Uploaded documents
- Provides options to view the property location on Google Maps, Apple Maps, or Open Street Maps.

### 5️⃣ Search Property Page
- Accessed from the bottom navigation bar (🔍 Search icon).
- Allows searching for properties by owner name, location, or phone number.
- Displays search results with property status (✅ Verified/🕗 Pending) and location.

### 6️⃣ Application Log & Comments
- **🕒 Application Log:**
  - Timeline of actions, comments, and document uploads related to a property application.
  - ⬇️ Downloadable documents and status updates.
- **💬 Add Comment/Request:**
  - Submit comments or requests and upload supporting documents.

### 7️⃣ Send Email
- Internal communication tool for agents to correspond with the Service Manager.
- 📎 Attach documents and send messages regarding property applications.

---

## 🗺️ Navigation Flow (Agent)
1. **🏠 Home Page** → Select property → **📝 Property Form Verification**
2. **📝 Property Form Verification** →
   - ➡️ Continue to Form
   - ✉️ Send Email
   - 📜 Application Log
   - ➕ Add Comment/Request
3. **✅ Reviewed Properties** (via tick button on Home) → Select property → **🗃️ Form Summary**
4. **🔍 Search** (bottom nav) → **🏷️ Search Property**

---

## 🏠 Add New Property Flow (Agent)

When the agent clicks the **➕ Add New Property** button from the Home page, the following step-by-step workflow is initiated. Each step corresponds to a form page where the agent must enter or select relevant property details. Navigation between steps is performed using the **Next** button, and drafts can be saved at any stage.

### 1️⃣ Property Information
- **Fields:**
  - 🏢 Category of Ownership (e.g., Private, Government, Vacant Land)
  - 🏘️ Building Use (Mixed, Non-Residential, Residential)
  - 🏢 Apartment/Complex Name
- **📍 Location Tag/Polygon:**
  - Click **Add Location Tag** or **Add Polygon** to open the map interface.
  - Select the property location or draw a polygon on the map.
  - ✔️ Confirm the location; the selected address and coordinates are displayed on the form.

### 2️⃣ Owner Details
- **Fields:**
  - 🆔 Aadhaar Number
  - 👤 Owner Name
  - 📱 Mobile Number
  - ⚧ Gender
  - 📧 Email Address
  - 🧑‍🦳 Guardian and Guardian Relationship (optional)
- **➕ Add Owner:** Add multiple owners as needed. Each owner’s details are displayed in a list.

### 3️⃣ Owner Details - Identity Proof
- **Fields:**
  - 👤 Select the primary owner
  - 🪪 Upload proof of identity (Aadhaar, Voter ID, PAN, etc.)

### 4️⃣ Property Address
- **Fields:**
  - 🏘️ Locality, 🏷️ Zone No, 🏛️ Ward No, 🧱 Block No, 🛣️ Street, 🗳️ Election Ward, 🏢 Secretariat Ward, 🔢 Pincode
  - Option to specify a correspondence address if different from the property address

### 5️⃣ Assessment Details
- **Fields:**
  - 📄 Reason for Creation
  - 📄 Occupancy Certificate Number & Date
  - 📏 Extent of Site (Sq.Yds)
  - 🏠 Land Underneath the Building (Sq.Yds)
  - Option for Unspecified/Undivided Share

### 6️⃣ IGRS and Building Setback Details
- **Fields:**
  - 🏘️ Habitation, 🗺️ IGRS Ward, 📍 Locality, 🧱 Block, 🔢 Door No (From/To), 🗂️ Classification
  - 📊 Built Up Area (percentage)
  - ↔️ Front, Rear, Side Setbacks (meters)
  - ◻️ Total Plinth Area (meters square)

### 7️⃣ IGRS Details (Amenities)
- **Fields:**
  - ⚡ Select amenities (Lift, Toilets, Water Tap, Cable Connection, Electricity, Attached Bathroom, Water Harvesting)

### 8️⃣ Construction Details
- **Fields:**
  - 🏗️ Floor Type, 🏠 Roof Type, 🧱 Wall Type, 🪵 Wood Type

### 9️⃣ Floor Details
- **Fields:**
  - 🔢 Floor Number, 🗂️ Classification of Building, 🏭 Nature of Usage, 🏢 Firm Name, 🚶 Occupancy, 👤 Occupant Name
  - 🏗️ Construction Date, 🗓️ Effective From Date
  - 🌾 Unstructured Land, 📏 Length, Breadth, Plinth Area, 📋 Building Permission No
  - 🌀 **Clone Floor:** Option to copy details to other floors
  - ⬜️ **Select Fields to be Copied:** Choose which fields to clone for additional floors

### 🔟 Document Upload
- **Fields:**
  - 📄 Document Type, 🔢 Serial No, 🧾 Revenue Document No
  - 📎 Upload supporting documents (PDF, images, etc.)

### 1️⃣1️⃣ Summary & Submission
- **📋 Summary Page:**
  - 🧐 Review all entered property, owner, assessment, and document details
  - ✏️ Edit any section if needed
  - 🗒️ Add important notes and upload photos if required
- **📤 Submit:** Final submission of the new property application

---

**ℹ️ Note:** At each step, agents can save the form as a draft and return later to complete the process. The form is designed to ensure all mandatory fields are filled and all required documents are uploaded before submission.

---

This is the complete flow of the Agent role in the DIGIT 3.0 Property Tax frontend.

By following this structured workflow, agents can efficiently manage property tax applications, ensure data accuracy, and streamline communication with other stakeholders. The intuitive interface and stepwise process help reduce errors, improve compliance, and enhance the overall service delivery experience for both agents and citizens. 

📚 This documentation serves as a comprehensive guide for understanding and utilizing all features available to agents in the DIGIT 3.0 Property Tax system.

# 🏡 Citizen Module Documentation

## 📝 Overview

The Citizen module in DIGIT 3.0 enables property owners and residents to manage their property-related information, view notifications, and interact with municipal services through a user-friendly interface. The module is designed to provide transparency, convenience, and self-service capabilities for citizens.

---

## ✨ Features of Each Page

### 🏠 Home Page
- **📄 Active Licenses & Number of Properties:** Quick summary cards showing the count of active licenses and registered properties.
- **🚨 Urgent Attention:** Alerts for important actions (e.g., license renewal, bill payments, tax registration).
- **🗺️/📋 Map/List Toggle:** Switch between map view and list view of properties.
- **📍 Property Markers:** Visual representation of properties on the map with enumeration progress.
- **➕ Add New Property:** Start a new property application (uses the same form flow as Agent).
- **🔖 Navigation Bar:** Access Home, Utilities, Properties, and My City sections.
- **🌐, 🔔 & 👤 Language, Notification, and Profile:** Quick access icons at the top for language selection, notifications, and profile management.

### 🏘️ My Properties Page
- **📜 Property List:** View all registered properties and draft applications.
- **🧮 Tax Calculator:** Access property tax calculation tool.
- **🏷️ Property Cards:** Each card shows address, status (Enumerated/Under Enumeration), and map location.
- **🗺️ View Location:** Directly view property location on the map.
- **📝 Draft Applications:** Access and manage draft property applications.

### 🏢 Property Information Page
- **🗂️ Overview Tab:**
  - Property type, construction year, built-up area, plot area, property value, survey number, ward.
  - Land use and zoning details (current use, approved use, zoning, FSI).
- **📐 Plot Info Tab:**
  - Survey number, subdivision, village, district, hobli, taluk, and building setbacks (front, rear, side, coverage).
- **📚 History Tab:**
  - Ownership and registration history, including owner names, property type, registration dates, and status.
- **📄 Documents Tab:**
  - Upload and view property-related documents (sale deed, affidavit, permission documents, property card, etc.).
  - Take image or upload files (PDF, JPG, PNG).
  - View, download, or delete uploaded documents.
- **📊 Enumeration Progress:**
  - Progress bar showing the completion status of property enumeration.
- **🗺️/🗾 Map/Land Use Toggle:**
  - Switch between map and land use zoning view for the property.

---

## 🧭 Citizen Workflow and Navigation

1. **🔑 Login → 🏠 Home Page**
   - Citizen logs in and lands on the Home page, viewing summary cards, urgent notifications, and a map/list of properties.
2. **🗺️/📋 Map/List Toggle**
   - Switch between map and list view to see properties visually or in a list format.
3. **➕ Add New Property**
   - Click the Add New Property button to start a new property application (follows the same multi-step form as Agent).
4. **🏘️ Properties Tab (Bottom Navigation)**
   - Navigate to the My Properties page to view all properties and drafts.
5. **👁️‍🗨️ View Property Details**
   - Click on a property card to open the Property Information page.
   - Access Overview, Plot Info, History, and Documents tabs for detailed information and actions.
6. **⬆️/👁️ Upload/View Documents**
   - In the Documents tab, upload new documents or view/download existing ones.

---

**🛠️ Note:** Some features and pages are under development and will be documented as they are completed.


---

📄 This is brief documentation. For more details, refer to the codebase or contact the maintainers.