package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"property-tax-onboarding/internal/config"
	"property-tax-onboarding/internal/constants"
	"property-tax-onboarding/pkg/logger"
)

type MDMSResponse struct {
	MDMS []struct {
		ID               string `json:"id"`
		TenantID         string `json:"tenantId"`
		SchemaCode       string `json:"schemaCode"`
		UniqueIdentifier string `json:"uniqueIdentifier"`
		Data             struct {
			Zone  string   `json:"zone"`
			Wards []string `json:"wards"`
		} `json:"data"`
		IsActive bool `json:"isActive"`
	} `json:"mdms"`
}

// GetZoneDetailsFromMDMS fetches zone details from the MDMS (Master Data Management System) API.
//
// Parameters:
//   - zone: A string representing the zone for which details are to be fetched.
//
// Returns:
//   - A pointer to an MDMSResponse object containing the zone details if the operation is successful.
//   - An error if the operation fails, such as issues with the HTTP request, response decoding, or non-200 status codes.
//
// Description:
// This method constructs an HTTP GET request to the MDMS API using the provided zone and the base URL
// fetched from the application configuration. It sets the necessary headers for the request, including
// content type, tenant ID, and client ID. The method sends the request using an HTTP client and processes
// the response. If the response status code is not 200 (OK), or if there is an error in decoding the response
// body, the method logs the error and returns it to the caller.
func GetZoneDetailsFromMDMS(zone string) (*MDMSResponse, error) {
	// Fetch the MDMS API URL from the configuration
	url := fmt.Sprintf("%s%s", config.GetConfig().MDMS_API_URL, zone)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		logger.Error(constants.ErrCreateMDMSRequest, "error", err)
		return nil, err
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("X-Tenant-ID", "pb.amritsar")
	req.Header.Set("X-Client-Id", "test-client")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		logger.Error(constants.ErrCallMDMSAPI, "error", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		logger.Error(constants.ErrMDMSAPINon200Status, "status", resp.StatusCode)
		return nil, fmt.Errorf("MDMS API returned status: %d", resp.StatusCode)
	}

	var mdmsResponse MDMSResponse
	if err := json.NewDecoder(resp.Body).Decode(&mdmsResponse); err != nil {
		logger.Error(constants.ErrDecodeMDMSResponse, "error", err)
		return nil, err
	}

	return &mdmsResponse, nil
}
