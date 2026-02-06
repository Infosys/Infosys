package workflow

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"net/http"
)

type Feature struct {
	Type       string `json:"type"`
	Properties struct {
		Corporatio string `json:"Corporatio"`
		WardID     string `json:"ward_id"`
		WardName   string `json:"ward_name"`
	} `json:"properties"`
	Geometry interface{} `json:"geometry"`
}

type GeoJSON struct {
	Features []Feature `json:"features"`
}

type WardInfo struct {
	Corporation string
	WardID      string
	WardName    string
}

type CorporationCount struct {
	Corporation string `json:"zone"`
	Wards       int    `json:"wards"`
}

func GetWardInfo(url, id string) ([]CorporationCount, error) {
	// Fetch data from URL
	url = fmt.Sprintf("%s/filestore/v1/files/%s?tenantId=pg", url, id)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("error fetching data from URL: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP request failed with status: %s", resp.Status)
	}

	// Read response body
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}

	// Parse JSON
	var geoJSON GeoJSON
	if err := json.Unmarshal(data, &geoJSON); err != nil {
		return nil, fmt.Errorf("error parsing JSON: %v", err)
	}

	// Extract ward information
	var wards []WardInfo
	for _, feature := range geoJSON.Features {
		// Skip if any required field is empty
		if feature.Properties.Corporatio == "" ||
			feature.Properties.WardID == "" ||
			feature.Properties.WardName == "" {
			continue
		}

		ward := WardInfo{
			Corporation: feature.Properties.Corporatio,
			WardID:      feature.Properties.WardID,
			WardName:    feature.Properties.WardName,
		}
		wards = append(wards, ward)
	}

	// Print results
	fmt.Printf("Total wards found: %d\n\n", len(wards))

	// Group by Corporation
	groupedByCorpo := make(map[string][]WardInfo)
	for _, ward := range wards {
		groupedByCorpo[ward.Corporation] = append(groupedByCorpo[ward.Corporation], ward)
	}

	// Create JSON output
	var corporationCounts []CorporationCount
	for corpo, wardList := range groupedByCorpo {
		corporationCounts = append(corporationCounts, CorporationCount{
			Corporation: corpo,
			Wards:       len(wardList),
		})
	}
	return corporationCounts, nil

}
