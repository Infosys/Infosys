// Package models defines database models and ORM mappings for the onboarding service.
// This file contains GORM models for users, profiles, addresses, and zone mappings.
package models

import (
	"time"
	"github.com/lib/pq"
)

// UserRole represents the possible user roles in the system.
// Used for role-based access and filtering.
type UserRole string

const (
	RoleAgent          UserRole = "AGENT"
	RoleCitizen        UserRole = "CITIZEN"
	RoleCommissioner   UserRole = "COMMISSIONER"
	RoleServiceManager UserRole = "SERVICE_MANAGER"
	RoleAdmin          UserRole = "ADMIN"
)

// User represents the unified database model for all users.
// Maps to the users table and includes profile and zone mapping relations.
type User struct {
	KeycloakUserID    string        `gorm:"primaryKey;column:keycloak_user_id;type:varchar(255)" json:"keycloak_user_id"`  // Primary key
	Username          string        `gorm:"unique;column:username;type:varchar(255)" json:"username"`                      // Unique username
	Email             string        `gorm:"unique;column:email;type:varchar(255)" json:"email"`                            // Unique email
	Role              UserRole      `gorm:"column:role;type:varchar(50)" json:"role"`                                      // User role (e.g., AGENT, CITIZEN, etc.)
	IsActive          bool          `gorm:"column:is_active;type:boolean" json:"is_active"`                                // Indicates if the user is active
	PreferredLanguage *string       `gorm:"column:preferred_language;type:varchar(50)" json:"preferredLanguage,omitempty"` // Preferred language (nullable)
	CreatedAt         time.Time     `gorm:"column:created_at;type:timestamp;autoCreateTime" json:"created_at"`             // Timestamp when the record was created
	UpdatedAt         time.Time     `gorm:"column:updated_at;type:timestamp;autoUpdateTime" json:"updated_at"`             // Timestamp when the record was last updated
	CreatedBy         *string       `gorm:"column:created_by;type:varchar(255)" json:"createdBy,omitempty"`                // User who created the record (nullable)
	UpdatedBy         *string       `gorm:"column:updated_by;type:varchar(255)" json:"updatedBy,omitempty"`                // User who last updated the record (nullable)"
	Deleted           bool          `gorm:"column:deleted;type:boolean;default:false" json:"deleted"`                      // Soft delete flag
	StartDate         *time.Time    `gorm:"column:start_date;type:date"`
	EndDate           *time.Time    `gorm:"column:end_date;type:date"`
	Profile           *UserProfile  `gorm:"foreignKey:user_profile_id;references:keycloak_user_id" json:"profile,omitempty"`
	ZoneMappings      []ZoneMapping `gorm:"foreignKey:UserID;references:KeycloakUserID"`
}

// UserProfile represents the user profile table in the database.
// Stores personal, contact, and property relationship details.
type UserProfile struct {
	ID                     string     `gorm:"primaryKey;column:user_profile_id" json:"user_profile_id"` // Use string instead of UUID
	FirstName              string     `gorm:"column:first_name" json:"first_name"`
	LastName               string     `gorm:"column:last_name" json:"last_name"`
	FullName               string     `gorm:"column:full_name" json:"full_name"`
	PhoneNumber            string     `gorm:"column:phone_number" json:"phone_number"`
	AdhaarNo               *int64     `gorm:"column:adhaar_no" json:"adhaar_no"`
	Gender                 string     `gorm:"column:gender" json:"gender"`
	Guardian               *string    `gorm:"column:guardian" json:"guardian"`
	GuardianType           *string    `gorm:"column:guardian_type" json:"guardian_type"`
	DateOfBirth            *time.Time `gorm:"column:date_of_birth" json:"date_of_birth"`
	Department             *string    `gorm:"column:department" json:"department"`
	Designation            *string    `gorm:"column:designation" json:"designation"`
	WorkLocation           *string    `gorm:"column:work_location" json:"work_location"`
	ProfilePicture         *string    `gorm:"column:profile_picture" json:"profile_picture"`
	RelationshipToProperty string     `gorm:"column:relationship_to_property" json:"relationship_to_property"`
	OwnershipShare         float64    `gorm:"column:ownership_share" json:"ownership_share"`
	IsPrimaryOwner         bool       `gorm:"column:is_primary_owner" json:"is_primary_owner"`
	IsVerified             bool       `gorm:"column:is_verified" json:"is_verified"`
	AddressID              *string    `gorm:"column:address_id" json:"address_id"`
	Address                *AddressDB `gorm:"foreignKey:AddressID;references:ID" json:"address,omitempty"`
}

// AddressDB represents the address table in the database.
// Used as a foreign key in user profiles.
type AddressDB struct {
	ID           string  `gorm:"primaryKey;column:id;type:uuid;default:gen_random_uuid()" json:"id"`
	AddressLine1 string  `gorm:"column:address_line1" json:"addressLine1"`
	AddressLine2 *string `gorm:"column:address_line2" json:"addressLine2"`
	City         string  `gorm:"column:city" json:"city"`
	State        string  `gorm:"column:state" json:"state"`
	PinCode      string  `gorm:"column:pin_code" json:"pinCode"`
}

// TableName overrides the default table name for AddressDB.
func (AddressDB) TableName() string {
	return "DIGIT3.address"
}

// ZoneMapping stores mapping of user to zones and wards.
// Used for zone/ward assignment and filtering.
type ZoneMapping struct {
	UserID    string         `gorm:"column:user_id;type:varchar(255);not null" json:"user_id"`
	Zone      string         `gorm:"column:zone;type:varchar(50)" json:"zone"`
	Wards     pq.StringArray `gorm:"column:ward;type:text[]" json:"wards"`
	CreatedAt time.Time      `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

// TableName overrides the default table name for ZoneMapping.
func (ZoneMapping) TableName() string {
	return "DIGIT3.zone_mapping"
}
