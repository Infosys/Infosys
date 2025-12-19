// Validation functions for property forms (Aadhar, mobile, certificate, email, dates, and form sections)

// Validate Aadhar number: must be 12 digits
export function validateAadhar(aadhar: string, messages: Record<string, string> = {}): string | null {
    if (!aadhar) return messages['aadhar.required'] || "Aadhar number is required";
    if (!/^\d{12}$/.test(aadhar)) return messages['aadhar.invalid'] || "Aadhar number must be 12 digits";
    return null;
}

// Validate mobile number: must be 10 digits, start with 6-9
export function validateMobile(mobile: string, messages: Record<string, string> = {}): string | null {
    if (!mobile) return messages['mobile.required'] || "Mobile number is required";
    if (!/^[6-9]\d{9}$/.test(mobile)) return messages['mobile.invalid'] || "Mobile number must start with 6-9 and be 10 digits";
    return null;
}

// Validate certificate number: alphanumeric, 6-20 characters
export function validateCertificateNumber(certNo: string, messages: Record<string, string> = {}): string | null {
    if (!certNo) return messages['certificate.required'] || "Certificate number is required";
    if (!/^[a-zA-Z0-9]{6,20}$/.test(certNo)) return messages['certificate.invalid'] || "Certificate number must be 6-20 alphanumeric characters";
    return null;
}

// Validate email address format
export function validateEmail(email: string, messages: Record<string, string> = {}): string | null {
    if (!email) return messages['email.required'] || "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return messages['email.invalid'] || "Invalid email address";
    return null;
}

// Validate date: must be today or before (no future dates)
export function validatePastOrToday(dateStr: string, messages: Record<string, string> = {}): string | null {
    if (!dateStr) return messages['date.required'] || "Date is required";
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (inputDate > today) return messages['date.future'] || "Date cannot be in the future";
    return null;
}

// Data structure for property address form section
interface PropertyAddressData {
  locality: string;
  zoneNo: string;
  wardNo: string;
  blockNo: string;
  street: string;
  electionWard: string;
  secretariatWard: string;
  pincode: string;
  isCorrespondenceAddressDifferent: boolean;
  correspondenceAddress1: string;
  correspondenceAddress2: string;
  correspondencePincode: string;
}

// Error messages for property address form fields
export interface PropertyAddressErrors {
  locality: string;
  zoneNo: string;
  wardNo: string;
  blockNo: string;
  electionWard: string;
  secretariatWard: string;
  pincode: string;
  correspondenceAddress1?: string;
  correspondenceAddress2?: string;
  correspondencePincode?: string;
}

// Validate all property address fields and return error messages
export function validatePropertyAddress(data: PropertyAddressData, messages: Record<string, string> = {}): PropertyAddressErrors {
  return {
    locality: data.locality.trim() ? '' : messages['locality.required'] || "Locality is required",
    zoneNo: /^\d{1,3}$/.test(data.zoneNo.trim()) ? '' : messages['zone.invalid'] || "Zone No must be 1-3 digits",
    wardNo: data.wardNo.trim() ? '' : messages['ward.required'] || "Ward No is required",
    blockNo: data.blockNo.trim() ? '' : messages['block.required'] || "Block No is required",
    electionWard: data.electionWard.trim() ? '' : messages['electionWard.required'] || "Election Ward is required",
    secretariatWard: data.secretariatWard.trim() ? '' : messages['secretariatWard.required'] || "Secretariat Ward is required",
    pincode: /^\d{6}$/.test(data.pincode.trim()) ? '' : messages['pincode.invalid'] || "Pincode must be 6 digits",
    correspondenceAddress1: '', 
    correspondencePincode: '',   
  };
}

// Data structure for assessment details form section
export interface AssessmentDetailsData {
  reason: string;
  occupancyCertificateNumber: string;
  occupancyCertificateDate: string;
  extentOfSite: string;
  landUnderBuilding: string;
}

// Error messages for assessment details form fields
export interface AssessmentDetailsErrors {
  reason: string;
  occupancyCertificateNumber: string;
  occupancyCertificateDate: string;
  extentOfSite: string;
  landUnderBuilding: string;
}

// Validate all assessment details fields and return error messages
export function validateAssessmentDetails(data: AssessmentDetailsData, messages: Record<string, string> = {}): AssessmentDetailsErrors {
  return {
    reason: data.reason ? '' : messages['reason.required'] || 'Reason is required',
    occupancyCertificateNumber: data.occupancyCertificateNumber.trim() ? '' : messages['certificateNumber.required'] || 'Certificate Number is required',
    occupancyCertificateDate: data.occupancyCertificateDate ? '' : messages['certificateDate.required'] || 'Certificate Date is required',
    extentOfSite:
      !data.extentOfSite
        ? messages['extentSite.required'] || 'Extent of Site is required'
        : Number(data.extentOfSite) <= 0
        ? messages['extentSite.positive'] || 'Must be a positive number'
        : '',
    landUnderBuilding:
      !data.landUnderBuilding
        ? messages['landUnderneath.required'] || 'Land Underneath is required'
        : Number(data.landUnderBuilding) <= 0
        ? messages['landUnderneath.positive'] || 'Must be a positive number'
        : '',
  };
}

// Data structure for ISGR details form section
export interface ISGRDetailsData {
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock: string;
  doorNoFrom: string;
  doorNoTo: string;
  igrsClassification: string;
  builtUpArea: string;
  frontSetBack: string;
  rearSetBack: string;
  sideSetBack: string;
  totalPlintArea: string;
}

// Error messages for ISGR details form fields
export interface ISGRDetailsErrors {
  habitation: string;
  igrsWard: string;
  igrsLocality: string;
  igrsBlock: string;
  igrsClassification: string;
  doorNoFrom: string;
  doorNoTo: string;
  builtUpArea: string;
  frontSetBack: string;
  rearSetBack: string;
  sideSetBack: string;
  totalPlintArea: string;
}

// Validate all ISGR details fields and return error messages
export function validateISGRDetails(data: ISGRDetailsData, messages: Record<string, string> = {}): ISGRDetailsErrors {
  return {
    habitation: data.habitation ? "" : messages['habitation.required'] || "Habitation is required",
    igrsWard: data.igrsWard ? "" : messages['igrsWard.required'] || "IGRS Ward is required",
    igrsLocality: data.igrsLocality ? "" : messages['igrsLocality.required'] || "IGRS Locality is required",
    igrsBlock: data.igrsBlock ? "" : messages['igrsBlock.required'] || "IGRS Block is required",
    doorNoFrom: data.doorNoFrom ? "" : messages['doorNoFrom.required'] || "IGRS Door No From is required",
    doorNoTo: data.doorNoTo ? "" : messages['doorNoTo.required'] || "IGRS Door No To is required",
    igrsClassification: data.igrsClassification ? "" : messages['igrsClassification.required'] || "IGRS Classification is required",
    builtUpArea: !data.builtUpArea 
      ? messages['builtUpArea.required'] || "Built Up Area is required"
      : Number(data.builtUpArea) <= 0
      ? messages['builtUpArea.positive'] || "Must be a positive number"
      : '',
    frontSetBack: !data.frontSetBack
      ? messages['frontSetBack.required'] || "Front Set Back is required"
      : Number(data.frontSetBack) < 0
      ? messages['frontSetBack.positive'] || "Must be a positive number"
      : '',
    rearSetBack: !data.rearSetBack
      ? messages['rearSetBack.required'] || "Rear Set Back is required"
      : Number(data.rearSetBack) < 0
      ? messages['rearSetBack.positive'] || "Must be a positive number"
      : '',
    sideSetBack: !data.sideSetBack
      ? messages['sideSetBack.required'] || "Side Set Back is required"
      : Number(data.sideSetBack) < 0
      ? messages['sideSetBack.positive'] || "Must be a positive number"
      : '',
    totalPlintArea: !data.totalPlintArea
      ? messages['totalPlintArea.required'] || "Total Plinth Area is required"
      : Number(data.totalPlintArea) <= 0
      ? messages['totalPlintArea.positive'] || "Must be a positive number"
      : '',
  };
}

// Data structure for document form section
export interface DocumentData {
  documentType: string;
  serialNoLabel: string;
  revenueDocumentNumber: string;
}

// Error messages for document form fields
export interface DocumentErrors {
  documentType: string;
  serialNoLabel: string;
  revenueDocumentNumber: string;
  // checkbox is not required
}

// Validate all document fields and return error messages
export function validateDocument(data: DocumentData, messages: Record<string, string> = {}): DocumentErrors {
  return {
    documentType: data.documentType ? '' : messages['documentType.required'] || 'Document Type is required',
    serialNoLabel: !data.serialNoLabel
      ? messages['no.required'] || 'No is required'
      : !/^[0-9]+$/.test(data.serialNoLabel)
      ? messages['no.invalid'] || 'No must contain only numbers'
      : '',
  
    revenueDocumentNumber: !data.revenueDocumentNumber
      ? messages['revenueDocumentNumber.required'] || 'Revenue Document Number is required'
      : !/^[0-9]+$/.test(data.revenueDocumentNumber)
      ? messages['revenueDocumentNumber.invalid'] || 'Revenue Document Number must be alphanumeric'
      : '',
  };
}