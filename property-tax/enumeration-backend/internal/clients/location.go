package workflow

import (
	"encoding/json"
	"fmt"
	"net/http"
	"bytes"
)
func InserttoProperty(data map[string]interface{}) {
	// Placeholder function to simulate insertion to Property
	// In a real implementation, this would interact with the Property service or repository
	url := "http://10.232.161.103:30213/v1/locations"
	jsonData, err := json.Marshal(data)
	if err != nil {
		fmt.Printf("Error marshalling data: %v\n", err)
		return
	}

	req, err := http.NewRequest("POST", url, bytes.NewReader(jsonData))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Tenant-ID", "pb.amritsar") // Set your tenant ID here

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making POST request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	fmt.Printf("Inserted coordinates to Property service, response status: %s\n", resp.Status)



}
func DeletefromProperty(propertyid string) {
	url := "http://10.232.161.103:30213/v1/locations/property"
	url= fmt.Sprintf("%s/%s", url, propertyid)
	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		fmt.Printf("Error creating DELETE request: %v\n", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Tenant-ID", "pb.amritsar") // Set your tenant ID here

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making DELETE request: %v\n", err)
		return
	}
	defer resp.Body.Close()
	fmt.Printf("Deleted coordinates from Property service, response status: %s\n", resp.Status)
}