// Service functions for file upload and download via filestore API

import { env } from "../../config/env";

// Response type for file upload
export interface UploadResult {
  files: {
    fileStoreId: string;
    tenantId: string;
  }[];
}

// Upload a file to the filestore and return upload result
export async function uploadFileToFilestore(file: File): Promise<UploadResult> {
  // Static values for tenant, module, and tag
  const tenantId = "pg";
  const module = "HCM-ADMIN-CONSOLE-CLIENT";
  const tag = "test";

  const formData = new FormData();
  formData.append('file', file);
  formData.append('tenantId', tenantId);
  formData.append('module', module);
  formData.append('tag', tag);

  const response = await fetch(`${env.FILESTORE_HOST}/filestore/v1/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

// Download a file from the filestore by fileStoreId and tenantId
export async function getFileFromFilestore(fileStoreId: string, tenantId: string = "pg"): Promise<Blob> {
  const url = `${env.FILESTORE_HOST}/filestore/v1/files/${fileStoreId}?tenantId=${tenantId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to download file');
  }
  return response.blob();
}