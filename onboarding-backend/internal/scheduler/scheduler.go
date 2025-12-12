// Package scheduler provides background job scheduling for the onboarding service.
// This file sets up cron jobs for periodic user activation and deactivation.
package scheduler

import (
	"log"                                           // For logging job execution
	"property-tax-onboarding/internal/repositories" // User repository interface
	"property-tax-onboarding/internal/services"     // Keycloak service
	"github.com/robfig/cron/v3" // Cron job scheduling library
)

// ScheduleUserActivation sets up a scheduled cron job for user activation/deactivation.
// Runs the ManageUserActivation method on the KeycloakService at the specified interval.
// Parameters:
//   - keycloakService: Service for managing Keycloak users
//   - userRepo: User repository for DB operations (not used directly here)
func ScheduleUserActivation(keycloakService *services.KeycloakService, userRepo repositories.UserRepository) {
	c := cron.New()

	// Schedule the task to run every day at midnight
	c.AddFunc("*/2 * * * *", func() {
		log.Println("Running daily user activation/deactivation task...")

		// Call the service layer to handle user activation/deactivation
		err := keycloakService.ManageUserActivation()
		if err != nil {
			log.Printf("Error in user activation/deactivation task: %v\n", err)
		}
	})

	// Start the cron scheduler
	c.Start()
}
