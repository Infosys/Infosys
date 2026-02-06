# db.json — Data usage map

This file documents where each top-level section and commonly-used fields in `db.json` are consumed in the application. I did NOT modify `db.json` itself (JSON does not support comments). Instead this file acts as the comment/reference you requested.

---

## Top-level sections

- `properties` (array)
  - Description: Main list of property records. Each object contains fields like `id`, `type`, `description`, `address`, `dueDate`, `status`, `phoneNumber`, `area`, `propertyType`, `isVerified`, `isDraft`, `isNew`, `createdDate`.
  - Used by:
    - `src/App.tsx` — `fetchData()` / `fetchProperties()` result is stored on `data.properties` and passed into pages.
    - `src/pages/HomePage.tsx` — Receives `properties` prop and renders the main property list and calendar tabs. Uses:
        - `id` → displayed in card header
        - `status` → status badge (High/Medium/Low)
        - `description` → reason/description area
        - `address` → address blocks and Location navigation
        - `dueDate` → calendar/date filtering
        - `isDraft` → used to identify draft cards shown when Drafts tab selected
        - `isNew` → used by the 'New' calendar tab filtering
        - `isVerified` → used by the 'Reviewed' calendar tab filtering
    - `src/pages/SearchPropertyPage.tsx` — `searchResults` prop may contain property objects (see App wiring). The result cards display `id`, `address`, `area`, `isVerified`, `propertyType`.
    - `src/pages/DraftPage.tsx` — when opening a draft (via `onDraftClick`) the selected property id is used to load the draft; fields such as `createdDate`/`isDraft` are relevant.
    - `src/pages/LocationPage.tsx` — App passes either `data.location` or a selected `property`'s `address` & `phoneNumber` (current App wiring prefers selected property when navigating to Location); `phoneNumber` on a property is used here.
    - `src/services/dataService.ts` — the `fetchProperties()` function targets the properties endpoint (`http://localhost:4000/properties`) and returns this array.

- `location` (object)
  - Description: A single jurisdiction/location record used for the header and fallback location info.
  - Fields: `address`, `coordinates { lat, lng }`, `phoneNumber`.
  - Used by:
    - `src/App.tsx` — `getHeaderProps()` uses `data?.location.address` as `headerProps.locationText` to show the jurisdiction in the layout header.
    - `src/pages/LocationPage.tsx` — originally passed directly; current App wiring will pass a selected property's address/phone as primary, but `data.location` remains available as fallback.
    - `src/services/dataService.ts` — `fetchData()` returns `location` within the combined static data payload.

- `searchResults` (array)
  - Description: Example result set used by Search page when present.
  - Used by:
    - `src/App.tsx` — may be passed into `SearchPropertyPage` as `searchResults` prop.
    - `src/pages/SearchPropertyPage.tsx` — `displayResults` reads `searchResults` prop and renders property result cards.

- `searchFields` (array)
  - Description: Dropdown options for the Search field select (e.g., All, Location, Owner Name, Phone Number).
  - Used by:
    - `src/pages/SearchPropertyPage.tsx` — component attempts to fetch `searchFields` from `/db.json` (client-side) and uses this to populate the select; if empty it falls back to hardcoded options.

- `messages` (array)
  - Description: Inbox messages, each with `id`, `title`, `description`, `date`, `type`, `isRead`, `priority`.
  - Used by:
    - `src/pages/InboxPage.tsx` — `fetchData()` provides `data.messages` which the Inbox page stores in state and renders message cards. Fields used:
        - `title`, `description`, `date` → displayed text
        - `type` → selects the icon (tax / verification / notification)
        - `isRead` → controls unread indicator and stats
        - `priority` → used for color-coded priority indicator and stats

- `insights` (object: `overview[]`, `properties[]`)
  - Description: Dashboard-style insights and per-property insight data.
  - Used by:
    - `src/pages/InsightsPage.tsx` — reads `data.insights.overview` and `data.insights.properties` to display overview cards and property insight rows.

---

## Field → UI mapping (quick reference)

- `id` (property) → property card header (`HomePage`, `SearchPropertyPage`) and link/selection for Location/Draft
- `address` → displayed on property cards, passed to `LocationPage` for map/address view
- `dueDate` → calendar filtering in `HomePage`
- `status` → status badge styling in `HomePage` (High/Medium/Low)
- `phoneNumber` → `LocationPage` call button / header phone fallback
- `area` → shown on search result card as small meta text
- `propertyType` → label on result cards
- `isDraft` → toggles draft list/cards under Drafts/Calendar tab
- `isVerified` → used for Reviewed filter/tab
- `isNew` → used for New filter/tab

## Where API calls live

- `src/services/dataService.ts` — central place for fetching data:
  - `fetchProperties()` — GET `http://localhost:4000/properties` (used to populate `properties` list)
  - `fetchData()` — combines properties (from API) with other static data from `/db.json` for messages, insights, searchFields, location (fallback)

## Notes & recommended workflow

- I did NOT modify `db.json` so json-server and static serving remain compatible.
- If you want inline comments in the JSON for local use only, keep a commented copy named `db.jsonc` or maintain this `docs/db-data-usage.md` file as the authoritative mapping.
- If you add new fields to `properties` (for example `coordinates` on each property), update `src/pages/LocationPage.tsx` and `src/services/dataService.ts` to use them.

---

If you'd like, I can also:
- generate a compact CSV/CSV-like export of important property fields,
- or annotate specific property entries with a per-id usage note in a separate file (e.g., `docs/property-usage/<id>.md`).

Tell me which additional format you prefer (inline JSONC, markdown per-id, or CSV), and I can add it.
