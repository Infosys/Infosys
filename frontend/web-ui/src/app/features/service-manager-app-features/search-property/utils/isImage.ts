// This file provides a utility function to check if a document is an image
// based on its file extension.

import type { Document } from "../models/GetAllProperties";

// Returns true if the document's name has an image file extension
export function isImage(doc: Document) {
  if (!doc?.DocumentName) return false; // Return false if no document name
  // Extract the file extension and convert to lowercase
  const ext = doc.DocumentName.split('.').pop()?.toLowerCase();
  // Check if the extension is one of the common image types
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
}