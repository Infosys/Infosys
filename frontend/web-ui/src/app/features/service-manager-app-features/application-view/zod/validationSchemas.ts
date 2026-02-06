// This file defines Zod validation schemas for various forms and cards in the property application view.
// Each exported schema validates the structure and rules for a specific form section (owner, address, property, etc).
import { z } from "zod";

// Helper regex for validation
// const onlyDigits = /^\d+$/; 
const onlyAlpha = /^[A-Za-z\s]+$/;
const mobileNumber = /^[6-9]\d{9}$/;

// Validation schema for the Owner Card section
export const ownerSchema = z.object({
  Name: z.string()
    .min(1, "Owner Name is required")
    .regex(onlyAlpha, "Name must contain only letters and spaces"),
  ContactNo: z.string()
    .length(10, "Mobile Number must be exactly 10 digits")
    .regex(mobileNumber, "Mobile Number must start with (6-9) number"),
  Email: z.email("Invalid email address"),
   AdhaarNo: z.number().refine(n => n.toString().length === 12, "Aadhaar number must be exactly 12 digits"),
});

// Validation schema for the Address Card section
// export const addressSchema = z.object({
//   Locality: z.string().min(1, "Locality is required"),
//   ZoneNo: z.string().regex(/^Zone-\d+$/, "ZoneNo must be in format Zone-0"),
//   WardNo: z.string().min(1, "Ward No is required"),
//   BlockNo: z.string().min(1, "Block No is required"),
//   ElectionWard: z.string().min(1, "Election Ward is required"),
//   SecretariatWard: z.string().min(1, "Secretariat Ward is required"),
//   PinCode: z.number().refine(n => n.toString().length === 6, "Pin Code must be exactly 6 digits"),
//   CorrespondenceAddress1: z.string().min(1, "Correspondence Address 1 is required"),
//   CorrespondencePincode: z.number().refine(n => n.toString().length === 6, "Pin Code must be exactly 6 digits"),
// });


export const addressSchema = z.object({
  Locality: z.string().min(1, "Locality is required"),
  ZoneNo: z.string().regex(/^Zone-\d+$/, "ZoneNo must be in format Zone-0"),
  WardNo: z.string().min(1, "Ward No is required"),
  BlockNo: z.string().min(1, "Block No is required"),
  ElectionWard: z.string().min(1, "Election Ward is required"),
  SecretariatWard: z.string().min(1, "Secretariat Ward is required"),
  PinCode: z.number().refine(n => n.toString().length === 6, "Pin Code must be exactly 6 digits"),
  // make correspondence fields optional; enforce conditionally below
  DifferentCorrespondenceAddress: z.boolean().optional(),
  CorrespondenceAddress1: z.string().optional(),
  CorrespondenceAddress2: z.string().optional(),
  CorrespondencePincode: z.number().optional(),
}).superRefine((data, ctx) => {
  if (data.DifferentCorrespondenceAddress) {
    if (!data.CorrespondenceAddress1 || data.CorrespondenceAddress1.trim() === "" || !data.CorrespondenceAddress1 || data.CorrespondenceAddress1.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["CorrespondenceAddress1"],
        message: "Correspondence Address 1 is required",
      });
    }
    if (data.CorrespondencePincode === undefined || data.CorrespondencePincode === null) {
      ctx.addIssue({
        code: "custom",
        path: ["CorrespondencePincode"],
        message: "Correspondence Pin Code is required",
      });
    } else if (data.CorrespondencePincode.toString().length !== 6) {
      ctx.addIssue({
        code: "custom",
        path: ["CorrespondencePincode"],
        message: "Pin Code must be exactly 6 digits",
      });
    }
  }
});

// Validation schema for the Property Card section
// export const propertySchema = z.object({
//   PropertyNo: z.string().min(1, "Property No is required"),
//   OwnershipType: z.string().min(1, "Ownership Type is required"),
//   PropertyType: z.string().min(1, "Property Type is required"),
//   ComplexName: z.string().min(1, "Complex Name is required"),
//   typeOfLand: z.string().min(1, "Type of Land is required"),
//   noOfFloors: z.number().min(0, "Number of Floors must be a positive number").optional(),
//   noOfBasements: z.number().min(0, "Number of Basements must be a positive number").optional(),
//   hasMezzanineFloor: z.string().optional(),
//   noOfBuildings: z.number().min(1, "Number of Buildings must be at least 1").optional(),
// });
export const propertySchema = z.object({
  PropertyNo: z.string().min(1, "Property No is required"),
  OwnershipType: z.string().min(1, "Ownership Type is required"),
  PropertyType: z.string().min(1, "Property Type is required"),
  ComplexName: z.string().min(1, "Complex Name is required"),
  typeOfLand: z.string().min(1, "Type of Land is required"),
  noOfFloors: z.number().optional(),
  noOfBasements: z.number().optional(),
  noOfBuildings: z.number().optional(),
  buildingNumberorName: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validation for "structure" type
  if (data.typeOfLand === "structure") {
    // noOfFloors is required and must be positive
    if (data.noOfFloors === undefined || data.noOfFloors === null) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfFloors"],
        message: "Number of Floors is required for structure type",
      });
    } else if (data.noOfFloors <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfFloors"],
        message: "Number of Floors must be a positive number",
      });
    }
    
    // noOfBasements is optional but must be positive if provided
    if (data.noOfBasements !== undefined && data.noOfBasements !== null && data.noOfBasements < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfBasements"],
        message: "Number of Basements must be a positive number",
      });
    }
  }
  
  // Validation for "multi" type
  if (data.typeOfLand === "multi") {
    // noOfBuildings is required and must be positive
    if (data.noOfBuildings === undefined || data.noOfBuildings === null) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfBuildings"],
        message: "Number of Buildings is required for multiple structures",
      });
    } else if (data.noOfBuildings <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfBuildings"],
        message: "Number of Buildings must be a positive number",
      });
    }
    
    // noOfFloors is required and must be positive
    if (data.noOfFloors === undefined || data.noOfFloors === null) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfFloors"],
        message: "Number of Floors is required for multiple structures",
      });
    } else if (data.noOfFloors <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfFloors"],
        message: "Number of Floors must be a positive number",
      });
    }
    
    // noOfBasements is required and must be positive
    if (data.noOfBasements === undefined || data.noOfBasements === null) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfBasements"],
        message: "Number of Basements is required for multiple structures",
      });
    } else if (data.noOfBasements < 0) {
      ctx.addIssue({
        code: "custom",
        path: ["noOfBasements"],
        message: "Number of Basements must be a positive number",
      });
    }
  }
});

// Validation schema for the Assessment Card section
export const assessmentSchema = z.object({
  ReasonOfCreation: z.string().min(1, "Reason of Creation is required"),
OccupancyCertificateNumber: z.string().optional().refine(
    (val) => !val || /^OC-\d{4}-\d{3}(-REVISED)?$/.test(val),
    { message: "Occupancy Certificate Number must be in format OC-0000-000" }
  ),
  OccupancyCertificateDate: z.string().optional().refine(
    (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
    { message: "Date must be in YYYY-MM-DD format" }
  ),
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
