// Centralized local storage service for property form app
// Handles saving, loading, and updating property form, documents, and photos in localStorage
// Data structure for all app data stored in localStorage
export interface AppData {
  propertyForm: {
    documentType: string;
    no: string;
    constructionDate: string;
    mroProceedingNumber: string;
    mroProceedingDate: string;
    courtName: string;
    testatorAndTwoWitnessesSigned: boolean;
  };
  documents: Array<{
    id: string;
    name: string;
    size: string; // human readable e.g. '2.4 MB'
    date: string; // display date
    status: 'uploaded' | 'pending';
  }>;
  photos: Array<{
    id: string;
    name: string;
    date: string;
  }>;
}

// Key used for storing app data in localStorage
const STORAGE_KEY = 'digitPropertyAppData';

// Default data structure used when nothing is stored yet
const defaultData: AppData = {
  propertyForm: {
    documentType: '',
    no: '',
    constructionDate: '',
    mroProceedingNumber: '',
    mroProceedingDate: '',
    courtName: '',
    testatorAndTwoWitnessesSigned: false
  },
  documents: [],
  photos: []
};

// Load all app data from localStorage, or return default if not found or invalid
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return { ...defaultData, ...parsed, propertyForm: { ...defaultData.propertyForm, ...parsed.propertyForm } };
  } catch (e) {
    console.warn('Failed to parse stored data, resetting.', e);
    return { ...defaultData };
  }
}

// Save the entire app data object to localStorage
export function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data', e);
  }
}

// Update only the propertyForm part of the data, merging with existing
export function updatePropertyForm(partial: Partial<AppData['propertyForm']>) {
  const current = loadData();
  const updated: AppData = { ...current, propertyForm: { ...current.propertyForm, ...partial } };
  saveData(updated);
  return updated.propertyForm;
}

// Get only the propertyForm data from localStorage
export function getPropertyForm() {
  return loadData().propertyForm;
}

// Add a new document or update an existing one by id
export function addOrUpdateDocument(doc: AppData['documents'][number]) {
  const current = loadData();
  const existingIndex = current.documents.findIndex(d => d.id === doc.id);
  if (existingIndex >= 0) {
    current.documents[existingIndex] = doc;
  } else {
    current.documents.push(doc);
  }
  saveData(current);
  return current.documents;
}

// Remove a document by id from the stored documents
export function removeDocument(id: string) {
  const current = loadData();
  current.documents = current.documents.filter(d => d.id !== id);
  saveData(current);
  return current.documents;
}

// Get all stored documents
export function getDocuments() {
  return loadData().documents;
}

// Reset all stored data to default values
export function resetAll() {
  saveData({ ...defaultData });
}
