
// This file defines Zod validation schemas for various forms and cards in the property application view.
// Each exported schema validates the structure and rules for a specific form section (owner, address, property, etc).
import { z } from "zod";

// Helper regex for validation
const onlyDigits = /^\d+$/; // Matches only digits
const onlyAlpha = /^[A-Za-z\s]+$/; // Matches only letters and spaces

// Validation schema for the Owner Card section
export const ownerSchema = z.object({
  Name: z.string()
    .min(1, "Owner Name is required")
    .regex(onlyAlpha, "Name must contain only letters and spaces"),
  ContactNo: z.string()
    .length(10, "Mobile Number must be exactly 10 digits")
    .regex(onlyDigits, "Mobile Number must be digits only"),
  Email: z.string().email("Invalid email address"),
   AdhaarNo: z.number().refine(n => n.toString().length === 12, "Aadhaar number must be exactly 12 digits"),
});

// Validation schema for the Address Card section
export const addressSchema = z.object({
  Locality: z.string().min(1, "Locality is required"),
  // ZoneNo: z.string().min(1, "Zone No is required"),
  ZoneNo: z.string().regex(/^Zone-\d+$/, "ZoneNo must be in format Zone-0"),
  WardNo: z.string().min(1, "Ward No is required"),
  BlockNo: z.string().min(1, "Block No is required"),
  Street: z.string().min(1, "Street is required"),
  ElectionWard: z.string().min(1, "Election Ward is required"),
  SecretariatWard: z.string().min(1, "Secretariat Ward is required"),
  PinCode: z.number()
    .refine(n => n.toString().length === 6, "Pin Code must be exactly 6 digits")
});

// Validation schema for the Property Card section
export const propertySchema = z.object({
  PropertyNo: z.string().min(1, "Property No is required"),
  OwnershipType: z.string().min(1, "Ownership Type is required"),
  PropertyType: z.string().min(1, "Property Type is required"),
  ComplexName: z.string().min(1, "Complex Name is required"),
});

// Validation schema for the Assessment Card section
export const assessmentSchema = z.object({
  ReasonOfCreation: z.string().min(1, "Reason of Creation is required"),
    OccupancyCertificateNumber: z.string()
    .regex(/^OC-\d{4}-\d{3}(-REVISED)?$/, "Occupancy Certificate Number must be in format OC-0000-000"),
  OccupancyCertificateDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  ExtentOfSite: z.string().min(1, "Extent of site is required"),
});

// Validation schema for the IGSR Card section
export const igsrSchema = z.object({
  igrsWard: z.string().min(1, "IGRS Ward is required"),
  igrsBlock: z.string().min(1, "IGRS Block is required"),
  igrsClassification: z.string().min(1, "IGRS Classification is required"),
  builtUpAreaPct: z.number()
  .min(0, "Must be positive")
  .max(100, "Cannot be more than 100"),
  totalPlinthArea: z.number().min(0, "Must be positive"),
  habitation: z.string().min(1, "Habitation is required"),
  igrsLocality: z.string().min(1, "IGRS Locality is required"),
  frontSetback: z.number().min(0, "Front Setback must be positive"),
  rearSetback: z.number().min(0, "Rear Setback must be positive"),
  sideSetback: z.number().min(0, "Side Setback must be positive"),
doorNoFrom: z.string()
  .regex(/^\d+$/, "Door No From must be digits only")
  .min(1, "Door No From is required"),
doorNoTo: z.string()
  .regex(/^\d+$/, "Door No To must be digits only")
  .min(1, "Door No To is required"),
});

// Validation schema for the Construction Card section
export const constructionSchema = z.object({
  FloorType: z.string().min(1, "Floor Type is required"),
  WallType: z.string().min(1, "Wall Type is required"),
  RoofType: z.string().min(1, "Roof Type is required"),
  WoodType: z.string().min(1, "Wood Type is required"),
});

// Validation schema for the Floor details section
export const floorSchema = z.object({
  FloorNo: z.number().min(0, "Floor No must be a positive number"),
  Classification: z.string().min(1, "Classification is required"),
  NatureOfUsage: z.string().min(1, "Nature of Usage is required"),
  FirmName: z.string().optional(),
  PlinthAreaSqFt: z.number().min(0, "Plinth Area (sqft) must be a positive number"),
  OccupancyName: z.string().regex(/^$|^[A-Za-z\s]+$/, "Occupancy Name must be letters only"),
  OccupancyType: z.string().optional(),
  BuildingPermissionNo: z.string().optional(),
  BreadthFt: z.number().min(0, "Breadth (ft) must be a positive number"),
  LengthFt: z.number().min(0, "Length (ft) must be a positive number"),
});

// export const floorSchema = z.object({
//   FloorNo: z.number().min(0, "Floor No must be a positive number"),
//   Classification: z.string().min(1, "Classification is required"),
//   NatureOfUsage: z.string().min(1, "Nature of Usage is required"),
//   FirmName: z.string().optional(),
//   PlinthAreaSqFt: z.number().min(0, "Plinth Area (sqft) must be a positive number").optional(),
//   OccupancyName: z.string().regex(/^$|^[A-Za-z\s]+$/, "Occupancy Name must be letters only").optional(),
//   OccupancyType: z.string().optional(),
//   BuildingPermissionNo: z.string().optional(),
//   BreadthFt: z.number().min(0, "Breadth (ft) must be a positive number").optional(),
//   LengthFt: z.number().min(0, "Length (ft) must be a positive number").optional(),
// });