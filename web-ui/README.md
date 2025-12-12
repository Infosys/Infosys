# 🏢 Property Tax Web UI

## 📋 Project Title & Description

**Property Tax Web UI**

A modern frontend application for managing and viewing property tax information.

This platform empowers municipal staff, commissioners, and service managers to:
- 🔐 **Role-based Authentication:** Secure access using Keycloak OAuth 2.0.
- 🏠 **Property & Application Management:** View, search, and manage property tax applications.
- 👨‍💼 **Agent Assignment:** Assign agents to applications and manage priorities.
- 📊 **Dashboards:** Commissioner and Service Manager dashboards for workflow insights.
- 🗺️ **Interactive Maps:** Visualize property locations and jurisdiction zones.
- 💻 **Responsive UI:** Built with Material-UI and custom styles for optimal user experience.
- 📚 **Component Library:** Storybook integration for reusable UI components.
- 🔗 **API Integration:** Connects to multiple microservices for data, onboarding, and file storage.
- 🚀 **Production-ready Deployment:** Docker and Rancher Kubernetes support.
The UI is designed for efficiency, clarity, and scalability, making property tax management seamless for local government teams and stakeholders.


## 🛠️ Tech Stack

- ⚛️ React 19 (TypeScript)
- ⚡ Vite (Build tool)
- 🎨 CSS (with custom styles, no CSS framework)
- 🧩 Storybook (UI component development)
- 🧹 ESLint (Linting, Flat config)
- 📦 npm (Package manager)
- 🗺️ Leaflet & React-Leaflet (interactive maps)
- 🗃️ Redux Toolkit (state management)
- 🧪 Zod (schema validation)
- 🧰 Docker (containerization for app and Storybook)
- 🗂️ MSW (Mock Service Worker for API mocking in development and Storybook)

---

## 📋 Prerequisites


- **🟢 Node.js:** v18.x or higher recommended
- **📦 npm:** v9.x or higher (comes with Node.js)
- No global dependencies required



---

## 🚀 Installation

```sh
git clone <repo-url>
cd property-tax-web-ui
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

### 📚 Run Storybook for UI components

```sh
npm run storybook
```
- 🧩 Starts Storybook for interactive UI component development and testing.

### 🏗️ Build Storybook static files

```sh
npm run build-storybook
```
- 🏗️ Builds static Storybook files for deployment or static hosting.

---

## Environment Variables

Set the following environment variables in a `.env` file at the project root to connect with microservices and authentication providers:

```env
VITE_ENUMERATION_HOST="<enumeration host url>"
VITE_TENANT_ID="<Tenant ID>"
VITE_FILESTORE_HOST="<filestore host url>"
VITE_ONBOARDING_HOST="<onboarding host url>"
VITE_KEYCLOAK_URL="<keycloak url>"
VITE_KEYCLOAK_REALM="<keycloak realm>"
VITE_KEYCLOAK_CLIENT_ID="<keycloak client id>"
VITE_KEYCLOAK_CLIENT_SECRET="<keycloak client secret>"
VITE_KEYCLOAK_SCOPE="<keycloak scope>"
```

## 🗂️ Project Structure

```
src/
  App.tsx
  index.css
  main.tsx
  app/
    global.css
    components/
      JurisdictionDropdown/
      Pagination/
      profile-modal/
      Sidebar/
    features/
      comissioner-app-features/
      Com_DashBoard/
      login-signup/
      service-manager-app-features/
    pages/
      commisioner-pages/
      Login-SignUp/
      map-pages/
      service-manager-pages/
    routes/
    styles/
  lib/
  store/
  stories/
  utils/
  assets/
docker-files/
  application/
  storybook/
json-server/
  application_view/
  SearchPropertyAndApplicationInbox/
  ServiceManagerDashboard/
public/
  wards.geojson
scripts/
  validate-geojson.ts
```


---

## 📜 Scripts

- `npm start` → Start development server
- `npm run build` → Build production bundle
- `npm run lint` → Run linter

---

## 🎨 Styling & UI

- Custom CSS (see `src/app/styles/`)
- No CSS framework (e.g., Tailwind, SCSS) is used by default
- Theme configuration can be added as needed

---

## 🔗 API Integration


All API logic is organized under:

- `src/app/features/[feature]/api/`

Each feature package contains its own `api` folder, where all related API calls and services are defined and maintained for modularity and clarity.

Example usage:

```js
import { getAllApplications } from "src/app/features/service-manager-app-features/all-applications/api/allApplicationApi";

getAllApplications().then(data => console.log(data));
```

API endpoints and integration details can be configured in the `.env` file and are used throughout these API modules.


## 🧑‍💼 Service Manager Module in DIGIT 3.0

The Service Manager module is designed for efficient management and supervision of property verification and application workflows. Service Managers can assign agents, monitor application statuses, review property details, and manage workload distribution. The interface is optimized for desktop use, providing a dashboard overview, application tracking, and agent management features.



## ✨ Features of Each Page

### 1. 🏠 Dashboard
- **🔑 Access:** Upon login, the Service Manager is directed to the Dashboard.
- **📝 Recent Applications:**
  - Displays a list of the most recent property applications with their status (🔴 High/🟡 Medium/🟢 Low priority), date, and time.
  - Each application card shows property name, application number, and a quick link to 🗺️ view location or 👨‍💼 assign agent.
- **📇 Agent Directory:**
  - Search and filter agents by ward.
  - View agent availability (🟢 Online/🌴 On Leave/⚪ Not Available), assigned wards, and total cases.
  - Assign new applications to available agents directly from the dashboard.
- **🔗 Navigation:**
  - Click **View All** to navigate to the All Applications page.
- **🖼️ Screenshot Reference:** `SM_Dashboard.png`

### 2. 🗃️ All Applications
- **🔓 Access:** Click "View All" on the Dashboard or select "All Applications" from the sidebar.
- **📋 Application List:**
  - Shows all property applications under enumeration and verification.
  - Each card displays property name, application number, address, date/time, type, and status.
  - Actions: 🌟 Set Priority, 👨‍💼 Assign Agent, and 🗺️ view property map.
- **🔍 Search & Filter:**
  - Search by Application No. or property name.
  - Sort applications by date (🆕 New-Old, 🕒 Old-New).
- **🚦 Status Indicators:**
  - Due dates, assigned agent, and priority are visually highlighted.
- **🔗 Navigation:**
  - Click on any application card to open the Application View.
- **🖼️ Screenshot Reference:** `SM_All_application.png`

### 3. 🔍 Application View
- **🔓 Access:** Click any application in All Applications or Dashboard.
- **🗺️ Map Section:**
  - Shows property location with options to ✏️ edit location or polygon.
  - ▶️ Start/✅ Finish buttons for workflow actions.
- **🗂️ Tabs:**
  - **📑 Property Details:**
    - Owner information, IGSR details, property and assessment details.
    - Editable fields for updating property data.
  - **📄 Documents:**
    - List of all uploaded documents (e.g., Sale Deed, Permission, Property Card).
    - Document status (✅ Verified, ❌ Rejected, ⏳ Pending), 🡇 download, and 👁️ view options.
    - Filter by document type (e.g., 👤 Citizen).
  - **💧 Services and Utilities:**
    - (Currently not used)
  - **📜 Change Log:**
    - Application history, previous actions, and downloadable logs.
    - 👀 Preview application from logs.
- **📊 Track Application:**
  - Timeline of application progress, inspection, comments, and document uploads.
  - 📎 Downloadable files and ➕ add comment option.
- **🖼️ Screenshot References:**
  - Property Details: `SM_Application View.jpg`
  - Documents: `SM_application View.png`
  - Change Log: `SM_application chnages.png`

### 4. 🏡 Search Property
- **🔓 Access:** Select "Search Property" from the sidebar.
- **🔍 Search & Filter:**
  - Search properties by property number or other criteria.
  - Filter and sort results by date.
- **🗺️ Map View:**
  - Visual map for quick property location reference.
- **📋 Property List:**
  - Each card shows property name, application number, address, and assigned agent.
  - Quick link to 👁️ view property details and location.
- **🖼️ Screenshot Reference:** `SM_Search.png`

### 5. 📥 Application Inbox
- **🔓 Access:** Select "Application Inbox" from the sidebar.
- **🏡 Property Selection:**
  - List of property applications with status (🔴 High/🟡 Medium/🟢 Low), due date, and assigned agent.
  - Select one or more properties for reassignment.
- **🔍 Filter & Search:**
  - Search by property name or application number.
  - Filter by status or ward.
- **🔄 Reassignment:**
  - Select new agent, provide reason for reassignment, and notify agent via 📲 SMS.
  - 🔁 Reassign property with a single click.
- **🖼️ Screenshot Reference:** `SM_assign page`

---

## 🧭 Service Manager Workflow and Navigation (Brief)

The Service Manager workflow is designed for efficiency and clarity, using a sidebar-driven navigation system:

1. **🔑 Login & Dashboard:**
   - After login, the Service Manager lands on the 🏠 Dashboard, which provides an overview of recent applications and agent availability.

2. **🗃️ All Applications:**
   - Clicking "View All" or selecting "All Applications" from the sidebar displays the full list of property applications, with options to search, filter, set priority, and assign agents.

3. **🔍 Application View:**
   - Selecting any application opens a detailed view with tabs for 📑 Property Details, 📄 Documents, 💧 Services and Utilities (not used yet), and 📜 Change Log. All relevant information and actions for the application are accessible here.

4. **☰ Sidebar Navigation:**
   - The sidebar allows quick access to:
     - 🏠 **Dashboard**
     - 🗃️ **All Applications**
     - 🏡 **Search Property** (search and filter properties, view on map)
     - 📥 **Application Inbox** (manage and reassign applications)

This structure ensures that Service Managers can efficiently monitor, assign, and track property applications, with all major actions accessible in just a few clicks.


## 📝 Notes

- The "💧 Services and Utilities" tab in Application View is currently not in use.
- All navigation is sidebar-driven for quick access to main modules.
- 👨‍💼 Agent assignment and workload management are core features for Service Managers.

**🛠️ Note:** Some features and pages are under development and will be documented as they are completed.


