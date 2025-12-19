import type { DocumentFile } from "./DocumentFile.model";

// Represents a legal or property-related document
export type Document = {
  no: string; // Document number or identifier
  files: DocumentFile[]; // List of associated document files
  courtName: string; // Name of the court (if applicable)
  documentType: string; // Type/category of the document
  constructionDate: string; // Date of construction (if relevant)
  mroProceedingDate: string; // Date of MRO (Mandal Revenue Officer) proceeding
  mroProceedingNumber: string; // MRO proceeding number
  testatorAndTwoWitnessesSigned: boolean; // Whether the document is signed by testator and two witnesses
}