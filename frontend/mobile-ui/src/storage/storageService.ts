// Per-page storage service for property app
// Each page (form, documents, photos) has its own key in localStorage
// Supports export/import as JSON for backup and restore

// Data structure for property form fields
export type PropertyFormData = {
  documentType: string;
  no: string;
  constructionDate: string;
  mroProceedingNumber: string;
  mroProceedingDate: string;
  courtName: string;
  testatorAndTwoWitnessesSigned: boolean;
};

// Data structure for a document item
export type DocumentItem = {
  id: string;
  name: string;
  size: string;
  date: string;
  status: 'uploaded' | 'pending';
};

// Data structure for a photo item
export type PhotoItem = {
  id: string;
  name: string;
  date: string;
};

// Keys used for storing each section in localStorage
const KEYS = {
  PROPERTY_FORM: 'digit_property_form',
  DOCUMENTS: 'digit_documents',
  PHOTOS: 'digit_photos'
};

// Safely parse JSON from localStorage, fallback if invalid
function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('Failed to parse stored JSON', e);
    return fallback;
  }
}

// Property form
// Default values for property form fields
const defaultPropertyForm: PropertyFormData = {
  documentType: '',
  no: '',
  constructionDate: '',
  mroProceedingNumber: '',
  mroProceedingDate: '',
  courtName: '',
  testatorAndTwoWitnessesSigned: false
};

// Load property form data from localStorage, or use defaults
export function loadPropertyForm(): PropertyFormData {
  return safeParse<PropertyFormData>(localStorage.getItem(KEYS.PROPERTY_FORM), defaultPropertyForm);
}

// Update and save property form data (merge with existing)
export function savePropertyForm(data: Partial<PropertyFormData>) {
  const current = loadPropertyForm();
  const updated = { ...current, ...data };
  localStorage.setItem(KEYS.PROPERTY_FORM, JSON.stringify(updated));
  return updated;
}

// Replace property form data entirely
export function replacePropertyForm(data: PropertyFormData) {
  localStorage.setItem(KEYS.PROPERTY_FORM, JSON.stringify(data));
}

// Export property form data as pretty-printed JSON string
export function exportPropertyForm(): string {
  return JSON.stringify(loadPropertyForm(), null, 2);
}

// Import property form data from a JS object (with basic validation)
export function importPropertyFormFromObject(obj: any) {
  // basic validation
  const sanitized: PropertyFormData = {
    ...defaultPropertyForm,
    ...obj
  };
  replacePropertyForm(sanitized);
}

// Documents
// Load documents array from localStorage
export function loadDocuments(): DocumentItem[] {
  return safeParse<DocumentItem[]>(localStorage.getItem(KEYS.DOCUMENTS), []);
}

// Add or update a document by id, then save
export function saveDocument(doc: DocumentItem) {
  const docs = loadDocuments();
  const idx = docs.findIndex(d => d.id === doc.id);
  if (idx >= 0) docs[idx] = doc; else docs.push(doc);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  return docs;
}

// Remove a document by id
export function removeDocument(id: string) {
  const docs = loadDocuments().filter(d => d.id !== id);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  return docs;
}

// Export documents array as pretty-printed JSON string
export function exportDocuments(): string {
  return JSON.stringify(loadDocuments(), null, 2);
}

// Import documents array from a JS object
export function importDocumentsFromObject(obj: any) {
  if (!Array.isArray(obj)) return;
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(obj));
}

// Photos
// Load photos array from localStorage
export function loadPhotos(): PhotoItem[] {
  return safeParse<PhotoItem[]>(localStorage.getItem(KEYS.PHOTOS), []);
}

// Add or update a photo by id, then save
export function savePhoto(photo: PhotoItem) {
  const photos = loadPhotos();
  const idx = photos.findIndex(p => p.id === photo.id);
  if (idx >= 0) photos[idx] = photo; else photos.push(photo);
  localStorage.setItem(KEYS.PHOTOS, JSON.stringify(photos));
  return photos;
}

// Export photos array as pretty-printed JSON string
export function exportPhotos(): string {
  return JSON.stringify(loadPhotos(), null, 2);
}

// Import photos array from a JS object
export function importPhotosFromObject(obj: any) {
  if (!Array.isArray(obj)) return;
  localStorage.setItem(KEYS.PHOTOS, JSON.stringify(obj));
}

// Helper to trigger download in browser
// Helper to trigger download of a file in the browser
export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Helper to read uploaded file and parse JSON
// Helper to read an uploaded file and parse its JSON content
export function readJsonFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    };
    reader.readAsText(file);
  });
}
