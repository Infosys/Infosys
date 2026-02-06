// PropertyInformation.tsx
// This component renders the property information step in the property registration form.
// Handles ownership, property type, apartment name, location tagging, polygons, and validation.
// Integrates with context, localization, and Redux API hooks.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/NewPropertyForm.css";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdEdit, MdClose } from "react-icons/md";
import { usePropertyForm } from "../../../context/PropertyFormContext";
import { useFormMode } from "../../../context/FormModeContext";
import JsonService from "../../../services/jsonServerApiCalls";
import authService from "../../../services/AuthService";
import "../../../styles/LocationSelection.css";
import { usePropertyInformationLocalization } from "../../../services/AgentLocalisation/localisation-propertyInformation";
import StepHeader from "../../features/Agent/components/StepHeader";
import { useLocalization } from "../../../services/AgentLocalisation/formLocalisation";
import { uniformInputSx, verifyButtonSx } from "./styles/sharedStyles";
import Button from "@mui/material/Button";
import type { AlertType } from "../../models/AlertType.model";
import {
  useLazyGetApplicationByIdQuery,
  useSubmitApplicationMutation,
} from "../../../redux/apis/applicationApi";
import {
  useDeleteGISDataMutation,
  useUpdateCoordinatesMutation,
} from "../../../redux/apis/gisApi";
import { usePropertyData } from "../../features/Agent/api/propertyData.hooks";
import { fetchPropertyDetails } from "../../features/Agent/api/fetchProperty.hooks";
import { NotificationPopup } from "../../components/Popup/NotificationPopup";
import { useLazyGetOwnersByPropertyIdQuery } from "../../../redux/apis/ownerApi";
import CustomDropdown from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import type { DropdownOption } from "../../features/PropertyForm/components/IGRSDetail/IGRSdropdown";
import FormTextField from "../../features/PropertyForm/components/IGRSDetail/IGRSFormTextFiled";

/**
 * PropertyInformation component
 * Renders the property information form step, manages local and global state, handles location and polygon tagging, and validates required fields.
*/
const PropertyInformation: React.FC = () => {
  // Context and navigation hooks
  const { formData, updateForm } = usePropertyForm();
  const { mode } = useFormMode();
  const navigate = useNavigate();
  
  // RTK Query hooks for property and GIS APIs
  const [getApplicationById] = useLazyGetApplicationByIdQuery();
  const [updateCoordinates] = useUpdateCoordinatesMutation();
  const [deleteGISData] = useDeleteGISDataMutation();
  const [getOwnerByPropId] = useLazyGetOwnersByPropertyIdQuery();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasModified, setHasModified] = useState(false);

  const markModified = () => {
    if (mode === "verify") setHasModified(true);
  };
  const appId = localStorage.getItem("applicationId") || localStorage.getItem("applicationLogId") || "";
  
  // Combine the first two useEffects
  // On mount: if in draft mode, fetch property details if needed; if mode is none, clear local storage
  useEffect(() => {
    if (mode === "draft") {
      const propertyId = localStorage.getItem("propertyId")!;
      const applicationId = localStorage.getItem("applicationId") || localStorage.getItem("applicationLogId") || "";

      if (!applicationId) {
        navigate("/agent");
      } else if (!formData.id) {
        // Only fetch if formData is empty
        fetchPropertyDetails(
          propertyId,
          applicationId,
          getApplicationById,
          getOwnerByPropId,
          updateForm,
          showErrorPopup
        );
      }
    } else if (mode === "none") {
      localStorage.removeItem("propertyId");
      localStorage.removeItem("applicationId");
      localStorage.removeItem("applicationLogId");
    }
  }, [mode]);

  // RTK Query hook for submitting application
  const [submitApplication] = useSubmitApplicationMutation();

  // Localization hook for property information step
  const {
    locale,
    categoryOwnershipLabel,
    propertyTypeLabel,
    apartmentNameLabel,
    apartmentNamePlaceholder,
    // addLocationTagBtn,
    addPolygonBtn,
    addressLabel,
    coordinatesLabel,
    addedAtText,
    onText,
    removeTagBtn,
    editLocationBtn,
    polygonLabel,
    pointText,
    removePolygonBtn,
    editPolygonBtn,
    saveDraftBtn,
    previousBtn,
    propertyFormTitle,
    newPropertyFormTitle,
    propertyInfoSubtitle,
  } = usePropertyInformationLocalization();

  // General localization hook for next button text
  const { nextButtonText } = useLocalization();

  // Context for global property form data

  // Custom hooks for saving property and GIS data
  const { savePropertyBasics, saveGISData, saveCoordinates } =
    usePropertyData();

  // Local state for this form step (prepopulated from context)
  const [localData, setLocalData] = useState({
    categoryOfOwnership: formData.categoryOfOwnership || "",
    propertyType: formData.propertyType || "",
    apartmentName: formData.apartmentName || ""
  });


  const [ownershipOptions, setOwnershipOptions] = useState<DropdownOption[]>(
    []
  );
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<
    DropdownOption[]
  >([]);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] =
    useState(false);

  // Validation state for dropdowns
  const [touched, setTouched] = useState({
    categoryOfOwnership: false,
    propertyType: false,
    apartmentName: false,
  });

  // Fetch ownership and property type options from JSON service on mount
  useEffect(() => {
    // Fetch ownership options and map to DropdownOption format
    JsonService.getOwnershipOptions().then((data) => {
      if (Array.isArray(data)) {
        setOwnershipOptions(
          data
            .filter((item) => item.name !== "select")
            .map((item, index) => ({ id: index, label: item.name }))
        );
      }
    });

    // Fetch property type options and map to DropdownOption format
    JsonService.getPropertyTypeOptions().then((data) => {
      if (Array.isArray(data)) {
        setPropertyTypeOptions(
          data
            .filter((item) => item.name !== "select")
            .map((item, index) => ({ id: index, label: item.name }))
        );
      }
    });
  }, []);

  // Sync local state with context data when formData changes
  // Also update original data to track if agent makes changes
  useEffect(() => {
    setLocalData({
      categoryOfOwnership: formData.categoryOfOwnership || "",
      propertyType: formData.propertyType || "",
      apartmentName: formData.apartmentName || ""
    });
  }, [
    formData.categoryOfOwnership,
    formData.propertyType,
    formData.apartmentName,
    formData.typeOfLand,
  ]);

  const handleDropdownSelect = (field: string, value: string) => {
    markModified();
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    updateForm(updatedData);
  };

  // Handler for closing other dropdowns
  const closeOtherDropdowns = (except?: string) => {
    if (except !== "categoryOfOwnership") setShowOwnershipDropdown(false);
    if (except !== "propertyType") setShowPropertyTypeDropdown(false);
  };

  const validateForm = () => {
    const missingFields: string[] = [];
    if (!localData.categoryOfOwnership)
      missingFields.push(categoryOwnershipLabel);
    if (!localData.propertyType) missingFields.push(propertyTypeLabel);
    if (!localData.apartmentName.trim()) missingFields.push(apartmentNameLabel);

    if (missingFields.length > 0) {
      // Mark fields as touched for validation display
      setTouched({
        categoryOfOwnership: !localData.categoryOfOwnership,
        propertyType: !localData.propertyType,
        apartmentName: !localData.apartmentName.trim(),
      });
      showErrorPopup(`Please fill in: ${missingFields.join(", ")}.`, 3500);
      return false;
    }

    if (
      typeof formData.locationData?.coordinates?.lat !== "number" ||
      typeof formData.locationData?.coordinates?.lng !== "number"
    ) {
      showErrorPopup("Please add a location tag before proceeding.", 3500);
      return false;
    }

    if (
      authService.isCitizen() === false &&
      formData.locationData?.drawnShapes?.length === 0
    ) {
      showErrorPopup("Please add a polygon before proceeding.", 3500);
      return false;
    }

    return true;
  };

  // Handler for form submission: validates, saves draft, and navigates to next step
  const handleSubmit = async () => {
    if (!validateForm()) return; // Prevent submission if not valid

    try {
      await handleSaveDraft();
      localStorage.removeItem("hasFieldModified");
      navigate("/property-form/owner-details-two");
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    localStorage.removeItem("hasFieldModified");
    navigate(-1);
  };

  // State for notification popup
  const [popup, setPopup] = useState<{
    type: AlertType;
    open: boolean;
    title: string;
    message: string;
    duration: number;
  }>({
    type: "warning",
    open: false,
    title: "",
    message: "",
    duration: 3000,
  });

  // Helper to show error notification popup
  function showErrorPopup(message: string, duration = 3000) {
    setPopup((prev) => ({ ...prev, open: false }));
    setTimeout(() => {
      setPopup({
        type: "warning",
        open: true,
        title: "Warning!",
        message,
        duration,
      });
    }, 10);
  }

  /**
   * Saves property basics and GIS data as a draft.
   * Updates form context and local storage as needed.
   * Submits application as draft if not already present.
   */
      const handleSaveDraft = async () => {
    try {
      setIsSubmitting(true);
      const hasFieldModified = localStorage.getItem("hasFieldModified") === "true";
      const isVerifying = mode === "verify" && (hasModified || hasFieldModified);
      const { propertyID: newPropertyID, propertyNo } =
        await savePropertyBasics(appId, isVerifying, formData.id);

      if (!formData.id) {
        localStorage.setItem("propertyId", newPropertyID);
      }

      updateForm({
        id: newPropertyID,
        propertyNo,
      });

      if (formData.locationData) {
        const gisDataId = await saveGISData(
          newPropertyID,
          formData.locationData.gisDataId
        );

        updateForm({
          locationData: {
            ...formData.locationData,
            gisDataId,
          },
        });

        await saveCoordinates(gisDataId, !!formData.locationData.gisDataId);
      }
      const applicationId = localStorage.getItem("applicationId") || localStorage.getItem("applicationLogId") || "";
      if (!applicationId) {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        const result = await submitApplication({
          propertyId: newPropertyID,
          appliedBy: user?.username,
          assesseeId: localStorage.getItem("user_id")!,
          isDraft: true,
          priority: "LOW",
          dueDate: new Date().toISOString(),
        }).unwrap();

        localStorage.setItem("applicationId", result.data.ID);
        localStorage.setItem("applicationLogId", result.data.ID);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to submit property data:", error);
      showErrorPopup("Failed to save property details");
      setIsSubmitting(false);
      throw error;
    }
  };

  // Handler for navigating to location tag selection
  const handleLocationTagClick = () => {
    navigate("/property-form/location-selection");
  };

  // Handler for navigating to polygon drawing mode
  const handleAddPolygon = () => {
    navigate("/property-form/location-selection?mode=polygon");
  };

  // Handler for removing the location tag (GIS data)
  const handleRemoveLocationTag = async () => {
    try {
      if (formData.locationData?.gisDataId) {
        await deleteGISData(formData.locationData.gisDataId).unwrap();
      }
      updateForm({ locationData: undefined });
    } catch (error) {
      console.error("Failed to remove location:", error);
      showErrorPopup("Failed to remove location");
    }
  };

  // Handler for editing the location tag
  const handleEditLocation = () => {
    navigate("/property-form/location-selection");
  };

  // Handler for removing a polygon shape from drawnShapes
 const handleRemovePolygon = async (polygonId: number) => {
    if (!formData.locationData?.drawnShapes) return;
    try {
      const gisDataId = formData.locationData.gisDataId;
      if (gisDataId) {
        await updateCoordinates({
          gisDataId: gisDataId,
          coordinates: [],
        }).unwrap();
      }

      // Filter out the polygon with the matching ID
      const newShapes = formData.locationData.drawnShapes.filter((s) => {
        if (s.type === "polygon" && s.id === polygonId) {
          return false; // Remove this polygon
        }
        return true; // Keep all other shapes
      });

      const newLocationData = {
        ...formData.locationData,
        drawnShapes: newShapes.length > 0 ? newShapes : [],
      };
      updateForm({ locationData: newLocationData });
    } catch (error) {
      console.error("Failed to remove polygon:", error);
      showErrorPopup("Failed to remove polygon");
    }
  };
  
  // Handler for editing a polygon shape
  const handleEditPolygon = () => {
    navigate("/property-form/location-selection?mode=polygon");
  };

  // Get error messages for dropdowns
  const getError = (
    field: "categoryOfOwnership" | "propertyType" | "apartmentName"
  ) => {
    if (!localData[field]) {
    let errorMsg = "";
    if (field === "categoryOfOwnership") {
      errorMsg = `Select an ownership category to proceed`;
    } else if (field === "propertyType") {
      errorMsg = `Select a property type to proceed`;
    } else {
      errorMsg = `Apartment/Complex name is mandatory`;
    }
    return errorMsg;
  }
    return "";
  };

  // Helper to get submit button text based on state
  const getSubmitButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (mode === "verify") return "Verify";
    return nextButtonText;
  };

  // Render the property information form UI
  return (
    <>
      <NotificationPopup
        type={popup.type}
        open={popup.open}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((p) => ({ ...p, open: false }))}
      />

      <div className="property-form-container" style={{ padding: "0" }}>
        <StepHeader
          title={
            mode === "new" ? `${newPropertyFormTitle}` : `${propertyFormTitle}`
          }
          subtitle={propertyInfoSubtitle}
          steps={10}
          activeStep={0}
          onPrevious={() => handleBack()}
          onSaveDraft={() => handleSaveDraft()}
          previousText={previousBtn}
          saveDraftText={saveDraftBtn}
        />

        <div className="form-content" key={locale}>
          <CustomDropdown
            label={categoryOwnershipLabel}
            name="categoryOfOwnership"
            value={localData.categoryOfOwnership}
            options={ownershipOptions}
            showDropdown={showOwnershipDropdown}
            setShowDropdown={setShowOwnershipDropdown}
            onSelect={handleDropdownSelect}
            closeOtherDropdowns={() =>
              closeOtherDropdowns("categoryOfOwnership")
            }
            selectText="Select"
            required={true}
            error={getError("categoryOfOwnership")}
            touched={touched.categoryOfOwnership}
            onBlur={() => setTouched({ ...touched, categoryOfOwnership: true })}
          />

          <CustomDropdown
            label={propertyTypeLabel}
            name="propertyType"
            value={localData.propertyType}
            options={propertyTypeOptions}
            showDropdown={showPropertyTypeDropdown}
            setShowDropdown={setShowPropertyTypeDropdown}
            onSelect={handleDropdownSelect}
            closeOtherDropdowns={() => closeOtherDropdowns("propertyType")}
            selectText="Select"
            required={true}
            error={getError("propertyType")}
            touched={touched.propertyType}
            onBlur={() => setTouched({ ...touched, propertyType: true })}
          />

          <FormTextField
            label={apartmentNameLabel}
            value={localData.apartmentName}
            onChange={(value) => {
              markModified();
              
              const updatedData = { ...localData, apartmentName: value };
              setLocalData(updatedData);
              updateForm(updatedData);
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, apartmentName: true }));
            }}
            required
            placeholder={apartmentNamePlaceholder}
            error={getError("apartmentName")}
            touched={touched.apartmentName}
            sx={{ width: "100%", ...uniformInputSx }}
            type="text"
          />

          {/* Always show Add Location button */}
          <div
            style={{
              paddingTop: 24,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <button
              className="location-tag-button"
              onClick={handleLocationTagClick}
            >
              <FaLocationCrosshairs size={16} />
              Add Location
            </button>

            {!authService.isCitizen() && (
              <button
                type="button"
                className="polygon-tag-button"
                onClick={handleAddPolygon}
              >
                <FaLocationCrosshairs size={16} />
                {addPolygonBtn}
              </button>
            )}
          </div>

          {formData.locationData && (
            <div className="property-card-summary orange-border">
              <div className="card-content">
                <div className="card-field">
                  <span className="field-label-bold">{addressLabel}:</span>
                  <span className="field-value">
                    {formData.locationData.address}
                  </span>
                </div>
                {formData.locationData.coordinates?.lat !== undefined &&
                  formData.locationData.coordinates?.lng !== undefined && (
                    <div className="card-field">
                      <span className="field-label-bold">
                        {coordinatesLabel}:
                      </span>
                      <span className="field-value-coordinates">
                        {formData.locationData.coordinates.lat.toFixed(6)}°,
                        {formData.locationData.coordinates.lng.toFixed(6)}°
                      </span>
                    </div>
                  )}
                <div className="card-timestamp orange">
                  {formData.locationData.timestamp ? (
                    <>
                      {addedAtText}{" "}
                      {new Date(
                        formData.locationData.timestamp
                      ).toLocaleTimeString("en-GB", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}{" "}
                      {onText}{" "}
                      {new Date(
                        formData.locationData.timestamp
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </>
                  ) : (
                    <>
                      {addedAtText}{" "}
                      {new Date().toLocaleTimeString("en-GB", {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}{" "}
                      {onText}{" "}
                      {new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </>
                  )}
                </div>
                <div className="card-actions">
                  <button
                    style={{
                      borderRadius: "10px",
                      marginLeft: "-8%",
                      width: "200%",
                      fontSize: "14px",
                    }}
                    className="card-action-btn remove-btn orange"
                    onClick={handleRemoveLocationTag}
                  >
                    <MdClose size={12} />
                    {removeTagBtn}
                  </button>
                  <button
                    style={{
                      borderRadius: "10px",
                      width: "200%",
                      fontSize: "14px",
                      background: "white",
                    }}
                    className="card-action-btn edit-btn orange"
                    onClick={handleEditLocation}
                  >
                    <MdEdit size={12} />
                    {editLocationBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {formData.locationData?.drawnShapes &&
            formData.locationData.drawnShapes.some(
              (s: any) => s.type === "polygon"
            ) && (
              <div style={{ marginTop: 16 }}>
                {formData.locationData.drawnShapes
                  .filter((s: any) => s.type === "polygon")
                  .map((poly: any) => (
                    <div
                      key={poly.id}
                      className="property-card-polygon green-border"
                    >
                      <div className="card-content">
                        <div className="card-field-polygon">
                          <span className="field-label-bold">
                            {polygonLabel}
                          </span>
                        </div>
                        <div className="card-field-coordinate">
                          <div
                            className="field-label-bold"
                            style={{ marginBottom: "4px" }}
                          >
                            {coordinatesLabel}
                          </div>
                          <div className="summary-coordinates-list">
                            {((poly.coordinates as number[][]) || []).map(
                              (cord: number[], cordCounter: number) => {
                                let lng = cord[0];
                                let lat = cord[1];
                                let cordKey = cordCounter;
                                if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
                                  lat = cord[0];
                                  lng = cord[1];
                                }
                                return (
                                  <div key={cordKey} className="coordinate-line">
                                    {pointText} {cordKey + 1} : {lat.toFixed(6)}°,{" "}
                                    {lng.toFixed(6)}°
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <div className="card-timestamp green">
                          {poly.addedAt ? (
                            <>
                              {addedAtText}{" "}
                              {new Date(poly.addedAt).toLocaleTimeString(
                                "en-GB",
                                {
                                  hour12: false,
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}{" "}
                              {onText}{" "}
                              {new Date(poly.addedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </>
                          ) : (
                            <>
                              {addedAtText}{" "}
                              {new Date().toLocaleTimeString("en-GB", {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}{" "}
                              {onText}{" "}
                              {new Date().toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </>
                          )}
                        </div>
                        <div className="card-actions">
                          <button
                            type="button"
                            style={{
                              width: "200%",
                              padding: "2%",
                              marginLeft: "-9%",
                              fontSize: "14px",
                            }}
                            className="card-action-btn remove-btn green"
                            onClick={() => handleRemovePolygon(poly.id)}
                          >
                            <MdClose size={12} />
                            {removePolygonBtn}
                          </button>
                          <button
                            type="button"
                            style={{
                              width: "200%",
                              padding: "2%",
                              fontSize: "14px",
                              background: "white",
                            }}
                            className="card-action-btn edit-btn green"
                            onClick={handleEditPolygon}
                          >
                            <MdEdit size={12} />
                            {editPolygonBtn}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
        </div>
        <div className="form-submit">
          <Button
            onClick={handleSubmit}
            sx={verifyButtonSx}
            variant="contained"
            disabled={isSubmitting}
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </div>
    </>
  );
};

// Export the PropertyInformation component as default
export default PropertyInformation;
