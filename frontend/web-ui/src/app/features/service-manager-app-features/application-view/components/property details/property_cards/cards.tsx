import { useState, useEffect } from 'react';
import {
  Box, Button, Typography
} from '@mui/material';
import EditSquareIcon from '../../../Assets/edit_square.svg';
import {
  propertyDetailsGridStyle,
  cardStyle,
  cardHeaderLabelStyle,
  cardLabelStyle,
  cardContentStyle,
  cardRowStyle,
  noteCardGridStyle,
  noteHeaderStyle,
  noteLabelStyle,
  noteDateStyle,
  noteContentTextStyle,
  trackCardStyle
} from "../../../Styles/searchPropertyStyles/cardsStyle";
import {
  ownerLabels,
  addressLabels,
  propertyLabels,
  assessmentLabels,
  igsrLabels,
  constructionLabels,
  floorLabels,
  additionalDetailsLabels,
 
} from "./cardLabels/cardLabels";

import EditOwnerPopover from './editCardPopup/editOwnerPopup';
import type { OwnerEditInput } from './editCardPopup/editOwnerPopup';
import EditAddressPopover from './editCardPopup/editAddressPopup';
import type { AddressEditInput } from './editCardPopup/editAddressPopup';
import EditPropertyPopover from './editCardPopup/editPropertypopup';
import EditAssessmentPopover from './editCardPopup/editAssessmentDetailsPopup';
import type { AssessmentEditInput } from './editCardPopup/editAssessmentDetailsPopup';
import EditIGSRPopover from './editCardPopup/editIgrsPopup';
import type { IGRSEditInput } from './editCardPopup/editIgrsPopup';
import EditConstructionPopover from './editCardPopup/editConstructionDetailsPopup';
import type { ConstructionEditInput } from './editCardPopup/editConstructionDetailsPopup';
import EditFloorPopover from './editCardPopup/editFloorDetailsPopup';
import type { FloorEditInput } from './editCardPopup/editFloorDetailsPopup';
import EditAmenitiesPopover from './editCardPopup/editAmenitiesPopup';
import type { AmenitiesEditInput } from './editCardPopup/editAmenitiesPopup';
import EditAdditionalDetailsPopover from './editCardPopup/editadditionalDetailspopup';
import type { AdditionalDetailsEditInput } from './editCardPopup/editadditionalDetailspopup';
import {
  useEditOwnerMutation,
  useEditAssessmentMutation,
  useEditIGRSMutation,
  useEditConstructionMutation,
  useEditFloorMutation,
  useEditAmenitiesMutation,
  useEditAdditionalDetailsMutation,
  useEditAddressMutation
} from '../../../api/edit-application-apis/editApplicationApi';
import { useGetOwnerByPropertyIdQuery, useEditApplicationMutation, useGetApplicationByApplicationIdQuery } from '../../../api/applicationApi';

import {
  ownerSchema,
  addressSchema,
  propertySchema,
  assessmentSchema,
  igsrSchema,
  constructionSchema,
  floorSchema
} from "../../../zod/validationSchemas";
import ApplicationTrack from '../../Application_Log/ApplicationTrack';
import z from 'zod';
import type { Property } from '../../../model/applicationByIdModel';
import { useGetMdmsEnumerationQuery } from '../../../api/mdmsService/mdmsApi';

import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../../store/index";
// Define land type label mappings
const LandTypeLabels: Record<string, string> = {
  vacant: 'Vacant Land',
  structure: 'Land with Structure',
  multi: 'Land with Multiple Structures',
  unit: 'Building Unit'
};


function pickFields<T>(obj: Record<string, any>, keys: readonly (keyof T)[]): Partial<T> {
  if (!obj) return {};
  const result: Partial<T> = {};
  keys.forEach(k => {
  if (obj[k as string] !== undefined) {
        result[k] = obj[k as string];
      }
  });
  return result;
}

function getChangedFields<T>(original: Partial<T>, updated: Partial<T>): Partial<T> {
  const changes: Partial<T> = {};
  Object.keys(updated).forEach(key => {
    const k = key as keyof T;
    if (updated[k] !== undefined && updated[k] !== original[k]) {
      changes[k] = updated[k];
    }
  });
  return changes;
}

function formatValueForLog(value: any): string {
  if (value === null || value === undefined) return 'Empty';
  if (value === '') return 'Empty';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : 'empty';
  if (value instanceof Error) return value.message;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function shouldShowOwnerField(key: string, value: any): boolean {
  if (key === 'Guardian' || key === 'GuardianType') {
    return value !== undefined && value !== null && value !== "";
  }
  return true;
}

function shouldShowAddressField(value: any): boolean {
  return value !== undefined && value !== 0 && value !== null && value !== "";
}

function getAddressDisplayValue(key: string, value: any): string {
  if (key === "DifferentCorrespondenceAddress") {
    if (value === true) return "Yes";
    if (value === false) return "Same as Current Address";
  }
  return formatValueForLog(value);
}

function shouldShowPropertyField(key: string, typeOfLand: string): boolean {
  const isVacantOrUnit = typeOfLand === 'vacant' || typeOfLand === 'unit';
  const conditionalFields = ['hasMezzanineFloor', 'noOfBasements', 'noOfBuildings', 'noOfFloors'];
  
  // Don't show conditional fields for vacant/unit types
  if (isVacantOrUnit && conditionalFields.includes(key)) {
    return false;
  }
  
  // Don't show noOfBuildings for structure type
  if (typeOfLand === 'structure' && key === 'noOfBuildings') {
    return false;
  }
  
  return true;
}

function getPropertyDisplayValue(key: string, value: any): string {
  if (key === 'typeOfLand' && typeof value === 'string') {
    return LandTypeLabels[value] || value;
  }
  if (key === 'hasMezzanineFloor' && typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return formatValueForLog(value);
}

function getErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  
  const anyErr = error as any;
  if (anyErr?.message && typeof anyErr.message === 'string') return anyErr.message;
  if (anyErr?.error?.message && typeof anyErr.error.message === 'string') return anyErr.error.message;
  if (anyErr?.data?.message && typeof anyErr.data.message === 'string') return anyErr.data.message;
  
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unexpected error occurred';
  }
}

function getAdditionalDetailsDisplayValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return formatValueForLog(value);
}

interface CardsProps {
  applicationID: string;
}


export default function Cards({ applicationID }: Readonly<CardsProps>) {

 
  const currentUserRole = useSelector((state: RootState) => state.user.currentUser?.role);
  
  const { data: application, error: apiError, isLoading: apiLoading, refetch } = useGetApplicationByApplicationIdQuery(applicationID);
  const status = application?.data.Status;
  const isEditDisabled = status === "AUDIT_VERIFIED";
  const shouldHideEditButton = currentUserRole === "COMMISSIONER" || status === "APPROVED";
  const [editOwner] = useEditOwnerMutation();
  const [editAssessment] = useEditAssessmentMutation();
  const [editIGRS] = useEditIGRSMutation();
  const [editConstruction] = useEditConstructionMutation();
  const [editFloor] = useEditFloorMutation();
  const [editApplication] = useEditApplicationMutation();
  const [editAmenities] = useEditAmenitiesMutation();
  const [editAdditionalDetails] = useEditAdditionalDetailsMutation();
  const [editAddress] = useEditAddressMutation();

  const propertyId = application?.data?.Property?.ID ?? '';
  const { data: ownerData, isLoading: ownerLoading, error: ownerError } = useGetOwnerByPropertyIdQuery(
    propertyId,
    { skip: !propertyId }
    
  );
  ;

  const [owners, setOwners] = useState<any[]>([]);
  const [editingOwnerIndex, setEditingOwnerIndex] = useState<number | null>(null);
  const [openOwnerPopover, setOpenOwnerPopover] = useState(false);

  const [address, setAddress] = useState<Partial<AddressEditInput>>({});
  const [openAddressPopover, setOpenAddressPopover] = useState(false);

  const [property, setProperty] = useState<Partial<Property>>({});
  const [openPropertyPopover, setOpenPropertyPopover] = useState(false);

  const [assessment, setAssessment] = useState<Partial<AssessmentEditInput>>({});
  const [openAssessmentPopover, setOpenAssessmentPopover] = useState(false);

  const [igsr, setIgsr] = useState<Partial<IGRSEditInput>>({});
  const [openIGSRPopover, setOpenIGSRPopover] = useState(false);

  const [construction, setConstruction] = useState<Partial<ConstructionEditInput>>({});
  const [openConstructionPopover, setOpenConstructionPopover] = useState(false);

  const [floors, setFloors] = useState<Array<Partial<FloorEditInput>>>([]);
  const [editingFloorIndex, setEditingFloorIndex] = useState<number | null>(null);
  const [openFloorPopover, setOpenFloorPopover] = useState(false);

  const [amenities, setAmenities] = useState<AmenitiesEditInput>({ property_id: "", type: [] });
  const [openAmenitiesPopover, setOpenAmenitiesPopover] = useState(false);

  const [additionalDetails, setAdditionalDetails] = useState<Partial<AdditionalDetailsEditInput>>({});
  const [openAdditionalDetailsPopover, setOpenAdditionalDetailsPopover] = useState(false);
  const schemaCode1 = 'PropertyTax.Enumeration';
  const schemaCode2 = 'PropertyTax.UnitOfMeasurement';
  const { data: mdmsData } = useGetMdmsEnumerationQuery(schemaCode1);
  const { data: mdmsData2 } = useGetMdmsEnumerationQuery(schemaCode2);
   console.log("Application Data:", application);
  

  const unit = mdmsData2?.unitOfmeasurement || "";


 
  useEffect(() => {
    if (Array.isArray(ownerData?.data)) {
      setOwners(ownerData.data);
    }
  }, [ownerData]);

  useEffect(() => {
    if (application?.data?.Property) {
      setAddress(pickFields<AddressEditInput>(application.data.Property.Address ?? {}, Object.keys(addressLabels) as (keyof AddressEditInput)[]));
      setProperty(pickFields<Property>(application.data.Property ?? {}, Object.keys(propertyLabels) as (keyof Property)[]));
      setAssessment(pickFields<AssessmentEditInput>(application.data.Property.AssessmentDetails ?? {}, Object.keys(assessmentLabels) as (keyof AssessmentEditInput)[]));
      setIgsr(pickFields<IGRSEditInput>(application.data.Property.IGRS ?? {}, Object.keys(igsrLabels) as (keyof IGRSEditInput)[]));
      setConstruction(pickFields<ConstructionEditInput>(application.data.Property.ConstructionDetails ?? {}, Object.keys(constructionLabels) as (keyof ConstructionEditInput)[]));
      setFloors(Array.isArray(application.data.Property.ConstructionDetails?.FloorDetails)
        ? application.data.Property.ConstructionDetails.FloorDetails.map((fl: any) =>
          pickFields<FloorEditInput>(fl, Object.keys(floorLabels) as (keyof FloorEditInput)[])
        )
        : []);
      setAmenities({
        property_id: application.data.Property.Amenities?.PropertyID ?? propertyId ?? "",
        type: application.data.Property.Amenities?.type ?? []
      });
      const adObj = application.data.Property.AdditionalDetails;
      if (adObj) {
        setAdditionalDetails({
          fieldName: adObj.FieldName ?? "",
          fieldValue: adObj.fieldValue ?? {},
          propertyId: adObj.PropertyID ?? ""
        });
      } else {
        setAdditionalDetails({});
      }
    }
  }, [application, propertyId]);

  // handle owner save
      const handleOwnerPopoverSave = async (fields: Partial<OwnerEditInput>) => {
        const idx = editingOwnerIndex;
        if (idx === null) return;

        const ownerObj = owners[idx];
        const ownerId = fields.ID || ownerObj?.ID || ownerObj?.id;

        if (!ownerId) {
          alert("Cannot edit owner: owner ID missing.");
          setOpenOwnerPopover(false);
          return;
        }

        // Log changed fields before editing
        const changedFields = getChangedFields<OwnerEditInput>(ownerObj, fields);

        const mergedOwner = {
          ...ownerObj,
          ...fields,
          AdhaarNo: fields.AdhaarNo === undefined ? ownerObj.AdhaarNo : Number(fields.AdhaarNo),
          propertyId: ownerObj.propertyId || application?.data?.Property?.ID,
        };

        const { ID, ...ownerPayload } = mergedOwner;
        const payload = {
          id: String(ownerId),
          owner: ownerPayload,
        };

        try {
          const response = await editOwner({ ...payload, applicationId: application?.data?.ID || '' }).unwrap();
          setOwners(prev => {
            const updated = [...prev];
            updated[idx] = response.data;
            return updated;
          });
          setOpenOwnerPopover(false);
          refetch();
        } catch (err) {
          console.error("editOwner mutation error:", err);
        }

        // Prepare log entries
        const logEntries = Object.entries(changedFields).map(
          ([key, value]) =>
            `${ownerLabels[key] || key} changed from ${formatValueForLog(ownerObj[key])} to ${formatValueForLog(value)}`
        );
        const comments = logEntries.join("; ");
        console.log("Owner Log Api Called with comments: ", comments);
        

        
      };

//  handle address save
  const handleAddressPopoverSave = async (fields: Partial<AddressEditInput>) => {
  setAddress(fields);
  const addressId = application?.data?.Property?.Address?.ID;
  if (!addressId) {
    alert("Cannot edit address: ID missing.");
    setOpenAddressPopover(false);
    return;
  }

 
  

  const updatedAddress = {
    propertyId: application?.data?.Property?.ID ?? "",
    PinCode: fields.PinCode === undefined ? 0 : Number(fields.PinCode),
    locality: fields.Locality ?? "",
    zoneNo: fields.ZoneNo ?? "",
    wardNo: fields.WardNo ?? "",
    blockNo: fields.BlockNo ?? "",
    street: fields.Street ?? "",
    correspondenceAddress1: fields.CorrespondenceAddress1 ?? "",
    correspondenceAddress2: fields.CorrespondenceAddress2 ?? "",
    correspondencePincode: fields.CorrespondencePincode === undefined ? 0 : Number(fields.CorrespondencePincode),
    electionWard: fields.ElectionWard ?? "",
    secretariatWard: fields.SecretariatWard ?? "",
    differentCorrespondenceAddress: fields.DifferentCorrespondenceAddress ?? false,
  };

  try {
    await editAddress({ id: addressId, body: updatedAddress, applicationId: application?.data?.ID || '' }).unwrap();
    setOpenAddressPopover(false);
    refetch();
  } catch (err) {
    console.error("Edit address error:", err);
  }

  
  
};

const handlePropertyPopoverSave = async (fields: Partial<Property>) => {
  // Log the rendered property state before update
  setProperty(fields);

  if (!application?.data?.Property) {
    alert("Cannot edit property: Property data missing.");
    setOpenPropertyPopover(false);
    return;
  }

  const updatedProperty: Property = {
    ...application.data.Property,
    ...fields,
    applicationId: application.data.ID
  } as Property;
  

  try {
    await editApplication({ property: updatedProperty, applicationId: application.data.ID }).unwrap();
    setOpenPropertyPopover(false);
    refetch();
  } catch (err) {
    console.error("Edit property error:", err);
  }

  


  
  
};

  const handleAssessmentPopoverSave = async (fields: Partial<AssessmentEditInput>) => {
  setAssessment(fields);
  const assessmentId = application?.data?.Property?.AssessmentDetails?.ID;
  const propertyId = application?.data?.Property?.ID;
  if (!assessmentId || !propertyId) {
    alert("Cannot edit assessment: ID or property ID missing.");
    setOpenAssessmentPopover(false);
    return;
  }
  if (!fields.ExtentOfSite || fields.ExtentOfSite.trim() === "") {
    alert("Extent of site is required.");
    return;
  }


      const payload = {
        id: String(assessmentId),
        body: {
          ReasonOfCreation: fields.ReasonOfCreation ?? "",
          OccupancyCertificateNumber: fields.OccupancyCertificateNumber ?? "",
          OccupancyCertificateDate: fields.OccupancyCertificateDate ?? "",
          ExtentOfSite: fields.ExtentOfSite ?? "",
          IsLandUnderneathBuilding: String(fields.isLandUnderneathBuilding ?? ""),
          IsUnspecifiedShare: fields.isUnspecifiedShare ?? false,
          PropertyID: String(propertyId ?? ""),
        }
      };

      try {
        await editAssessment({ ...payload, applicationId: application?.data?.ID || '' }).unwrap();
        setOpenAssessmentPopover(false);
        refetch();
      } catch (err) {
        console.error("Edit assessment error:", err);
      }

     

     
    };

  const handleIGSRPopoverSave = async (fields: Partial<IGRSEditInput>) => {
  setIgsr(fields);

  if (!application?.data?.Property?.IGRS) {
    alert("Cannot edit IGRS: IGRS data missing.");
    setOpenIGSRPopover(false);
    return;
  }

  const id = application.data.Property.IGRS.id;
  if (!propertyId || !id) {
    alert("Cannot edit IGRS: ID missing.");
    setOpenIGSRPopover(false);
    return;
  }

 
  
  const body = {
    propertyId: application.data.Property.ID,
    habitation: fields.habitation ?? "",
    igrsWard: fields.igrsWard ?? "",
    igrsLocality: fields.igrsLocality ?? "",
    builtUpAreaPct: fields.builtUpAreaPct ?? 0,
    totalPlinthArea: fields.totalPlinthArea ?? 0,
    igrsBlock: fields.igrsBlock ?? "",
    doorNoFrom: fields.doorNoFrom ?? "",
    doorNoTo: fields.doorNoTo ?? "",
    igrsClassification: fields.igrsClassification ?? "",
    frontSetback: fields.frontSetback ?? 0,
    rearSetback: fields.rearSetback ?? 0,
    sideSetback: fields.sideSetback ?? 0,
  };

  try {
    await editIGRS({
      id,
      body,
      applicationId: application?.data?.ID || ''
    }).unwrap();
    setOpenIGSRPopover(false);
    refetch();
  } catch (err) {
    console.error("Edit IGRS error:", err);
  }

 

  
};

  const handleConstructionPopoverSave = async (fields: Partial<ConstructionEditInput>) => {
      setConstruction(fields);
      const constructionId = application?.data.Property.ConstructionDetails.ID;

     

      const Putbody = {
        ...fields as any,
        propertyId: application?.data.Property.ID
      };

      try {
        await editConstruction({
          id: constructionId ?? "",
          body: Putbody,
          applicationId: application?.data?.ID || ''
        }).unwrap();
        setOpenConstructionPopover(false);
        refetch();
      } catch (err) {
        console.error("Construction edit error:", err);
      }

    

     
    };

  const handleFloorPopoverSave = async (fields: Partial<FloorEditInput>) => {
      const idx = editingFloorIndex;

      if (idx === null) return;
      setFloors(prev => {
        const updated = [...prev];
        updated[idx] = { ...floors[idx], ...fields };
        return updated;
      });
      const originalFloorData = application?.data?.Property?.ConstructionDetails?.FloorDetails?.[idx];
      const floorId = originalFloorData?.ID;
      const constructionDetailsId = originalFloorData?.ConstructionDetailsID;
      if (!floorId) {
        alert("Cannot edit floor: ID missing.");
        setOpenFloorPopover(false);
        return;
      }

      

      const floorBody = {
        FloorNo: fields.FloorNo ? Number(fields.FloorNo) : 0,
        Classification: fields.Classification ?? "",
        NatureOfUsage: fields.NatureOfUsage ?? "",
        FirmName: fields.FirmName ?? "",
        OccupancyType: fields.OccupancyType ?? "",
        OccupancyName: fields.OccupancyName ?? "",
        ConstructionDate: fields.ConstructionDate ?? "",
        EffectiveFromDate: fields.EffectiveFromDate ?? "",
        UnstructuredLand: fields.UnstructuredLand ?? "",
        LengthFt: fields.LengthFt ? Number(fields.LengthFt) : 0,
        BreadthFt: fields.BreadthFt ? Number(fields.BreadthFt) : 0,
        PlinthAreaSqFt: fields.PlinthAreaSqFt ? Number(fields.PlinthAreaSqFt) : 0,
        BuildingPermissionNo: fields.BuildingPermissionNo ?? "",
        FloorDetailsEntered: fields.FloorDetailsEntered ?? false,
        ConstructionDetailsID: constructionDetailsId ?? "",
      };

      try {
        await editFloor({
          id: floorId,
          body: floorBody,
          applicationId: application?.data?.ID || ''
        }).unwrap();
        setOpenFloorPopover(false);
        refetch();
      } catch (err) {
        console.error("Floor edit error:", err);
      }

     

    
    };

  const handleAmenitiesPopoverSave = async (fields: Partial<AmenitiesEditInput>) => {
  const property_id = fields.property_id ?? propertyId ?? "";
  const type = Array.isArray(fields.type) ? fields.type : [];
  const amenitiesId = application?.data.Property.Amenities?.ID;

  if (!amenitiesId || !property_id) {
    alert("Amenities ID or Property ID missing!");
    return;
  }

  

  setAmenities({ property_id, type });
  try {
    await editAmenities({
      id: amenitiesId,
      propertyId: property_id,
      amenities: { property_id, type },
      applicationId: application?.data?.ID || ''
    }).unwrap();
    setOpenAmenitiesPopover(false);
    refetch();
  } catch (err) {
    console.error("Amenities edit error:", err);
    setOpenAmenitiesPopover(false);
  }

 

 

};

const handleAdditionalDetailsPopoverSave = async (fields: Partial<AdditionalDetailsEditInput>) => {
  setAdditionalDetails(fields);
  const additionalDetailsObj = application?.data.Property.AdditionalDetails;
  if (!additionalDetailsObj?.ID) {
    alert("Cannot edit additional details: ID missing.");
    setOpenAdditionalDetailsPopover(false);
    return;
  }

 
 

  const payload = {
    id: additionalDetailsObj.ID,
    propertyId: additionalDetailsObj.PropertyID,
    additionalDetails: {
      fieldName: fields.fieldName ?? additionalDetailsObj.FieldName,
      fieldValue: fields.fieldValue ?? additionalDetailsObj.fieldValue,
      propertyId: additionalDetailsObj.PropertyID,
    }
  };

  try {
    await editAdditionalDetails({ ...payload, applicationId: application?.data?.ID || '' }).unwrap();
    setOpenAdditionalDetailsPopover(false);
    refetch();
  } catch (err) {
    console.error("Additional details edit error:", err);
  }

  

 
};

  // Popover togglers
  const handleOwnerEditClick = (idx: number) => {
    setEditingOwnerIndex(idx);
    setOpenOwnerPopover(true);
  };
  const handleOwnerPopoverClose = () => setOpenOwnerPopover(false);

  const handleAddressEditClick = () => setOpenAddressPopover(true);
  const handleAddressPopoverClose = () => setOpenAddressPopover(false);

  const handlePropertyEditClick = () => setOpenPropertyPopover(true);
  const handlePropertyPopoverClose = () => setOpenPropertyPopover(false);

  const handleAssessmentEditClick = () => setOpenAssessmentPopover(true);
  const handleAssessmentPopoverClose = () => setOpenAssessmentPopover(false);

  const handleIGSREditClick = () => setOpenIGSRPopover(true);
  const handleIGSRPopoverClose = () => setOpenIGSRPopover(false);

  const handleConstructionEditClick = () => setOpenConstructionPopover(true);
  const handleConstructionPopoverClose = () => setOpenConstructionPopover(false);

  const handleFloorEditClick = (e: React.MouseEvent<HTMLElement>, idx: number) => {
    setEditingFloorIndex(idx);
    setOpenFloorPopover(true);
    e.stopPropagation();
  };
  const handleFloorPopoverClose = () => setOpenFloorPopover(false);

  const handleAmenitiesEditClick = () => setOpenAmenitiesPopover(true);
  const handleAmenitiesPopoverClose = () => setOpenAmenitiesPopover(false);

  const handleAdditionalDetailsEditClick = () => setOpenAdditionalDetailsPopover(true);
  const handleAdditionalDetailsPopoverClose = () => setOpenAdditionalDetailsPopover(false);

  if (apiLoading || ownerLoading) {
    return <Box sx={{ display: 'grid', width: '100%' }}>Loading...</Box>;
  }
  
  if (apiError || ownerError) {
    return <Box sx={{ display: 'grid', width: '100%' }}>Error: {getErrorMessage(apiError || ownerError)}</Box>;
  }
  
  if (!application) {
    return <Box sx={{ display: 'grid', width: '100%' }}>No property found.</Box>;
  }

  return (
    <Box sx={propertyDetailsGridStyle}>
      {/* Owner Information */}
      {owners.length > 0 && owners.map((ownerObj, idx) => {
        const ownerFormFields = pickFields<OwnerEditInput>(ownerObj, Object.keys(ownerLabels) as (keyof OwnerEditInput)[]);
        return (
          <Box sx={cardStyle} key={ownerObj.ID || idx}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={cardHeaderLabelStyle}>
                Owner Information{owners.length > 1 ? ` (${idx + 1})` : ""}
              </Typography>
             
            {!shouldHideEditButton && (
              <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={() => handleOwnerEditClick(idx)} disabled={isEditDisabled}>
                <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
              </Button>
            )}
            </Box>
            {Object.entries(ownerFormFields)
              .filter(([key, value]) => shouldShowOwnerField(key, value))
              .map(([key, value]) => (
                <Box sx={cardRowStyle} key={key}>
                  <Typography style={cardLabelStyle} component="span">{ownerLabels[key] || key}:</Typography>
                  <Typography style={cardContentStyle} component="span">{formatValueForLog(value)}</Typography>
                </Box>
              ))}
            {openOwnerPopover && editingOwnerIndex === idx && (
                <EditOwnerPopover
                  open={openOwnerPopover}
                  onClose={handleOwnerPopoverClose}
                  fields={ownerFormFields}
                  labels={ownerLabels}
                  onSave={handleOwnerPopoverSave}
                  schema={ownerSchema}
                  genderOptions={mdmsData?.genderOptions ?? []}
                  guardianRelationshipOptions={mdmsData?.guardianRelationshipOptions ?? []}
                />
              )}
          </Box>
        );
      })}

      {/* Address Details card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>Address Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0,opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleAddressEditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
        {Object.entries(address)
          .filter(([_, value]) => shouldShowAddressField(value))
          .map(([key, value]) => (
            <Box sx={cardRowStyle} key={key}>
              <Typography style={cardLabelStyle} component="span">{addressLabels[key] || key}:</Typography>
              <Typography style={cardContentStyle} component="span">{getAddressDisplayValue(key, value)}</Typography>
            </Box>
          ))}
       {openAddressPopover && (
            <EditAddressPopover
              open={openAddressPopover}
              onClose={handleAddressPopoverClose}
              fields={address}
              labels={addressLabels}
              onSave={handleAddressPopoverSave}
              schema={addressSchema}
              blockNoOptions={mdmsData?.blockNoOptions ?? []}
              wardNoOptions={mdmsData?.wardNoOptions ?? []}
              electionWardOptions={mdmsData?.electionWardOptions ?? []}
              secretariatWardOptions={mdmsData?.secretariatWardOptions ?? []}
            />
          )}
      </Box>

   {/* Property Details card */}
    <Box sx={cardStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={cardHeaderLabelStyle}>Property Info</Typography>
        {!shouldHideEditButton && (
          <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={handlePropertyEditClick} disabled={isEditDisabled}>
            <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
          </Button>
        )}
      </Box>
      {Object.entries(property)
        .filter(([key]) => shouldShowPropertyField(key, property.typeOfLand as string))
        .map(([key, value]) => (
          <Box sx={cardRowStyle} key={key}>
            <Typography style={cardLabelStyle} component="span">{propertyLabels[key] || key}:</Typography>
            <Typography style={cardContentStyle} component="span">{getPropertyDisplayValue(key, value)}</Typography>
          </Box>
        ))}
      {openPropertyPopover && (
        <EditPropertyPopover
          open={openPropertyPopover}
          onClose={handlePropertyPopoverClose}
          fields={property}
          labels={propertyLabels}
          onSave={handlePropertyPopoverSave}
          schema={propertySchema}
          ownershipOptions={mdmsData?.ownershipOptions ?? []}      
          propertyTypeOptions={mdmsData?.propertyTypeOptions ?? []}
        />
      )}
    </Box>

      {/* Assessment card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>Assessment Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0,opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleAssessmentEditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
        
        {Object.entries(assessment).map(([key, value]) => {
          // Extract the ternary operation into an independent variable
          const unitValue = typeof unit === "string" ? unit : undefined;
          
          return (
            <Box sx={cardRowStyle} key={key}>
              <Typography style={cardLabelStyle} component="span">
                {typeof assessmentLabels[key] === "function"
                  ? (assessmentLabels[key] as (unit?: string) => string)(unitValue)
                  : assessmentLabels[key] || key}
                :
              </Typography>
              <Typography style={cardContentStyle} component="span">
                {formatValueForLog(value)}
              </Typography>
            </Box>
          );
        })}

        {openAssessmentPopover && (
          <EditAssessmentPopover
            open={openAssessmentPopover}
            onClose={handleAssessmentPopoverClose}
            fields={assessment}
            labels={assessmentLabels}
            onSave={handleAssessmentPopoverSave}
            schema={assessmentSchema}
            reasonOptions={mdmsData?.reason ?? []}
          />
        )}
      </Box>

      {/* IGSR card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>IGSR Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleIGSREditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
       {Object.keys(igsrLabels).map(key => {
          const typedKey = key as keyof IGRSEditInput;
          const unitValue = typeof unit === "string" ? unit : undefined;

          return (
            <Box sx={cardRowStyle} key={key}>
              <Typography style={cardLabelStyle} component="span">
                {typeof igsrLabels[key] === "function"
                  ? (igsrLabels[key] as (unit?: string) => string)(unitValue)
                  : igsrLabels[key] || key}
                :
              </Typography>
              <Typography style={cardContentStyle} component="span">
                {formatValueForLog(igsr[typedKey])}
              </Typography>
            </Box>
          );
        })} 
        {openIGSRPopover && (
            <EditIGSRPopover
              open={openIGSRPopover}
              onClose={handleIGSRPopoverClose}
              fields={igsr}
              labels={igsrLabels}
              onSave={handleIGSRPopoverSave}
              schema={igsrSchema}
              igrsBlockOptions={mdmsData?.igrsBlock ?? []}
              igrsWardOptions={mdmsData?.igrsWard ?? []}
              igrsClassificationOptions={mdmsData?.igrsClassification ?? []}
              igrsLocalityOptions={mdmsData?.igrsLocality ?? []}
            />
          )}
      </Box>

      {/* Construction details card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>Construction Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleConstructionEditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
        {Object.entries(construction).map(([key, value]) => (
          <Box sx={cardRowStyle} key={key}>
            <Typography style={cardLabelStyle} component="span">{constructionLabels[key] || key}:</Typography>
            <Typography style={cardContentStyle} component="span">{formatValueForLog(value)}</Typography>
          </Box>
        ))}
       {openConstructionPopover && (
        <EditConstructionPopover
          open={openConstructionPopover}
          onClose={handleConstructionPopoverClose}
          fields={construction}
          labels={constructionLabels}
          onSave={handleConstructionPopoverSave}
          schema={constructionSchema}
          floorTypeOptions={mdmsData?.floorType ?? []}
          wallTypeOptions={mdmsData?.wallType ?? []}
          roofTypeOptions={mdmsData?.roofType ?? []}
          woodTypeOptions={mdmsData?.woodType ?? []}
        />
      )}
      </Box>

      {/* Floor Details cards */}
      {floors.length > 0 &&
        floors.map((floor: any, idx) => {
          const floorFields = { ...floor };
          return (
            <Box sx={cardStyle} key={floor.ID || idx}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={cardHeaderLabelStyle}>
                  Floor Details {floors.length > 1 ? idx + 1 : ""}
                </Typography>
                {!shouldHideEditButton && (
                  <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={e => handleFloorEditClick(e, idx)} disabled={isEditDisabled}>
                    <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
                  </Button>
                )}
              </Box>
              {Object.entries(floorFields).map(([key, value]) => (
                <Box sx={cardRowStyle} key={key}>
                  <Typography style={cardLabelStyle} component="span">{floorLabels[key] || key}:</Typography>
                  <Typography style={cardContentStyle} component="span">{formatValueForLog(value)}</Typography>
                </Box>
              ))}
              {openFloorPopover && editingFloorIndex === idx && (
                <EditFloorPopover
                  open={openFloorPopover}
                  onClose={handleFloorPopoverClose}
                  fields={floorFields}
                  labels={floorLabels}
                  onSave={handleFloorPopoverSave}
                  schema={floorSchema}
                  buildingClassificationOptions={mdmsData?.buildingClassification ?? []}
                  natureOfUsageOptions={mdmsData?.natureOfUsage ?? []}
                  occupancyOptions={mdmsData?.occupancy ?? []}
                  unstructuredLandOptions={mdmsData?.unstructuredLand ?? []}
                />
              )}
            </Box>
          );
        })}

      {/* Amenities card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>Amenities Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleAmenitiesEditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
        {Array.isArray(amenities.type) && amenities.type.length > 0
          ? amenities.type.map((amen, idx) => (
            <Box sx={cardRowStyle} key={`${amen}-${idx}`}>
              <Typography style={cardLabelStyle} component="span">{amen}</Typography>
            </Box>
          ))
          : <Typography sx={{ pt: 2, pb: 2 }}>No amenities available</Typography>
        }
        {openAmenitiesPopover && (
          <EditAmenitiesPopover
            open={openAmenitiesPopover}
            onClose={handleAmenitiesPopoverClose}
            fields={amenities}
            // labels={amenitiesLabels}
            onSave={handleAmenitiesPopoverSave}
            schema={z.object({})}
            options={mdmsData?.isgrAdditionalOptions ?? []}
          />
        )}
      </Box>
      
      {/* Additional Details card */}
      <Box sx={cardStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={cardHeaderLabelStyle}>Additional Details</Typography>
          {!shouldHideEditButton && (
            <Button aria-label="edit" size="small" sx={{ minWidth: 0, ml: 1, p: 0, opacity: isEditDisabled ? 0.5 : 1 }} onClick={handleAdditionalDetailsEditClick} disabled={isEditDisabled}>
              <img src={EditSquareIcon} alt="edit" style={{ width: 20, height: 20 }} />
            </Button>
          )}
        </Box>
        {additionalDetails.fieldName && (
          <Box sx={cardRowStyle}>
            <Typography style={cardLabelStyle} component="span">Field Name:</Typography>
            <Typography style={cardContentStyle} component="span">{additionalDetails.fieldName}</Typography>
          </Box>
        )}
      {additionalDetails.fieldValue && Object.keys(additionalDetails.fieldValue).length > 0
        ? Object.entries(additionalDetails.fieldValue)
            .filter(([_, value]) => value !== undefined && value !== null && value !== "")
            .map(([key, value]) => (
              <Box sx={cardRowStyle} key={key}>
                <Typography style={cardLabelStyle} component="span">
                  {additionalDetailsLabels[key] || key.replaceAll("_", " ")}:
                </Typography>
                <Typography style={cardContentStyle} component="span">
                  {getAdditionalDetailsDisplayValue(value)}
                </Typography>
              </Box>
            ))
        : <Typography sx={{ pt: 2, pb: 2 }}>No additional details available</Typography>
      }
        {openAdditionalDetailsPopover && (
          <EditAdditionalDetailsPopover
            open={openAdditionalDetailsPopover}
            onClose={handleAdditionalDetailsPopoverClose}
            fields={additionalDetails}
            labels={additionalDetailsLabels}
            onSave={handleAdditionalDetailsPopoverSave}
            schema={z.object({})}
            reasonOptions={mdmsData?.reasonOptions ?? []}
            documentTypes={mdmsData?.documentTypes ?? []} 
          />
        )}
      </Box>

      {/* Note Card */}
      <Box sx={noteCardGridStyle}>
        <Box sx={noteHeaderStyle}>
          <Typography sx={noteLabelStyle} component="span">Important Note:</Typography>
          <Typography sx={noteDateStyle} component="span">{application.data.CreatedAt?.split("T")[0]}</Typography>
        </Box>
        <Box>
          <Typography sx={noteContentTextStyle}>
            <span style={{ margin: 0 }}>
             {application?.data.importantNote? application.data.importantNote: "No data found"}</span>
          </Typography>
        </Box>
      </Box>

      {/* Track Application */}
      <Box sx={trackCardStyle}>
        <ApplicationTrack applicationId={application?.data?.ID} logs={application?.data?.ApplicationLogs ?? []} />
      </Box>
    </Box>
  );
}