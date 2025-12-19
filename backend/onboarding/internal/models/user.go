// Package models defines data structures and DTOs for API requests, responses, and database mapping.
// This file contains user-related models for the Property Tax Onboarding Service.
package models

import (
	"fmt"
	"time"
)

// CreateUserRequest represents the request payload for creating a new user (citizen, agent, etc.).
// Used in POST /api/v1/users. Includes profile and ward info.
type CreateUserRequest struct {
	Username          string             `json:"username"`
	Email             string             `json:"email"`
	Password          string             `json:"password"`
	Role              UserRole           `json:"role"`
	ZoneData          []ZoneData         `json:"zonedata"`
	PreferredLanguage *string            `json:"preferredLanguage,omitempty"`
	CreatedBy         *string            `json:"createdBy,omitempty"`
	UpdatedBy         *string            `json:"updatedBy,omitempty"`
	Deleted           bool               `json:"deleted,omitempty"`
	StartDate         *time.Time         `json:"startDate,omitempty"`
	EndDate           *time.Time         `json:"endDate,omitempty"`
	Profile           UserProfileRequest `json:"profile"`
}

type ZoneData struct {
	ZoneNumber string   `json:"zoneNumber"`
	Wards      []string `json:"wards"`
}

// UserResponse represents the unified response payload for any user
type UserResponse struct {
	ID                string              `json:"id"`
	Username          string              `json:"username"`
	Email             string              `json:"email"`
	Role              string              `json:"role"`
	IsActive          bool                `json:"isActive"`
	ZoneData          []ZoneData          `json:"zoneData"`
	PreferredLanguage *string             `json:"preferredLanguage,omitempty"`
	CreatedDate       time.Time           `json:"createdDate"`
	UpdatedDate       time.Time           `json:"updatedDate"`
	CreatedBy         *string             `json:"createdBy,omitempty"`
	UpdatedBy         *string             `json:"updatedBy,omitempty"`
	StartDate         *time.Time          `json:"startDate,omitempty"`
	EndDate           *time.Time          `json:"endDate,omitempty"`
	Profile           UserProfileResponse `json:"profile"`
}

// UserProfileResponse represents the profile section of a user in API responses.
// Includes personal, contact, and property relationship details.
type UserProfileResponse struct {
	FirstName              string     `json:"firstName"`
	LastName               string     `json:"lastName"`
	FullName               string     `json:"fullName"`
	PhoneNumber            string     `json:"phoneNumber"`
	AdhaarNo               *int64      `json:"adhaarNo"`
	Gender                 string     `json:"gender"`
	Guardian               *string    `json:"guardian,omitempty"`
	GuardianType           *string    `json:"guardianType,omitempty"`
	DateOfBirth            *time.Time `json:"dateOfBirth,omitempty"`
	Address                *Address   `json:"address,omitempty"`
	Department             *string    `json:"department,omitempty"`
	Designation            *string    `json:"designation,omitempty"`
	WorkLocation           *string    `json:"workLocation,omitempty"`
	ProfilePicture         *string    `json:"profilePicture,omitempty"`
	RelationshipToProperty string     `json:"relationshipToProperty"`
	OwnershipShare         float64    `json:"ownershipShare"`
	IsPrimaryOwner         bool       `json:"isPrimaryOwner"`
	IsVerified             bool       `json:"isVerified"`
}

// UserProfileRequest represents the profile section in user creation/update requests.
// Used for validating and capturing user profile details.
type UserProfileRequest struct {
	FirstName              string  `json:"firstName" binding:"required"`
	LastName               string  `json:"lastName" binding:"required"`
	FullName               string  `json:"fullName" binding:"required"`
	PhoneNumber            string  `json:"phoneNumber" binding:"required"`
	AdhaarNo               *int64   `json:"adhaarNo"`
	Gender                 string  `json:"gender"`
	RelationshipToProperty string  `json:"relationshipToProperty"`
	OwnershipShare         float64 `json:"ownershipShare"`
	IsPrimaryOwner         bool    `json:"isPrimaryOwner"`
	Department             *string `json:"department"`
	Designation            *string `json:"designation"`
}

// Address represents a user's address in both requests and responses.
// Used as a nested struct in user profile models.
type Address struct {
	AddressLine1 string  `json:"addressLine1"`
	AddressLine2 *string `json:"addressLine2"`
	City         string  `json:"city"`
	State        string  `json:"state"`
	PinCode      string  `json:"pinCode"`
}

// KeycloakUser represents a user object for Keycloak integration.
// Used for syncing user data with the Keycloak identity provider.
type KeycloakUser struct {
	ID            string                 `json:"id,omitempty"`
	Username      string                 `json:"username"`
	Email         string                 `json:"email"`
	EmailVerified bool                   `json:"emailVerified"`
	FirstName     string                 `json:"firstName"`
	LastName      string                 `json:"lastName"`
	Enabled       bool                   `json:"enabled"`
	Attributes    map[string]interface{} `json:"attributes,omitempty"`
	Credentials   []KeycloakCredential   `json:"credentials,omitempty"`
}

// KeycloakCredential represents a credential object for Keycloak users.
// Used for password and authentication management in Keycloak.
type KeycloakCredential struct {
	Type      string `json:"type"`
	Value     string `json:"value"`
	Temporary bool   `json:"temporary"`
}

// KeycloakRole represents a role in Keycloak
type KeycloakRole struct {
	ID          string `json:"id,omitempty"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

// UpdateUserRequest represents the request payload for updating a user
type UpdateUserRequest struct {
	Email             string            `json:"email"`
	Role              UserRole          `json:"role"`
	IsActive          bool              `json:"isActive"`
	PreferredLanguage *string           `json:"preferredLanguage"`
	Profile           UpdateUserProfile `json:"profile"`
	CreatedBy         *string           `json:"createdBy,omitempty"`
	UpdatedBy         *string           `json:"updatedBy,omitempty"`
	EndDate           *time.Time        `json:"endDate,omitempty"`
}

// UpdateUserProfile represents the profile data in update request
type UpdateUserProfile struct {
	FirstName              string     `json:"firstName"`
	LastName               string     `json:"lastName"`
	FullName               string     `json:"fullName"`
	PhoneNumber            string     `json:"phoneNumber"`
	AdhaarNo               *int64      `json:"adhaarNo"`
	Gender                 string     `json:"gender"`
	Guardian               string     `json:"guardian"`
	GuardianType           string     `json:"guardianType"`
	DateOfBirth            string     `json:"dateOfBirth"`
	Department             string     `json:"department"`
	Designation            string     `json:"designation"`
	WorkLocation           string     `json:"workLocation"`
	ProfilePicture         string     `json:"profilePicture"`
	RelationshipToProperty string     `json:"relationshipToProperty"`
	OwnershipShare         float64    `json:"ownershipShare"`
	IsPrimaryOwner         bool       `json:"isPrimaryOwner"`
	IsVerified             bool       `json:"isVerified"`
	AddressID              *string    `gorm:"column:address_id" json:"addressId"`
	Address                *AddressDB `json:"address,omitempty"`
}

// UserFilters represents filters for getting users with search criteria
type UserFilters struct {
	Role        []UserRole `json:"role,omitempty"`
	IsActive    *bool     `json:"isActive,omitempty"`
	Username    *string   `json:"username,omitempty"` // Partial match
	Email       *string   `json:"email,omitempty"`    // Partial match
	Ward        *[]string `json:"ward,omitempty"`
	Deleted     bool      `json:"deleted,omitempty"`
	PhoneNumber *string   `json:"phoneNumber,omitempty"`
}

// UsersListResponse represents the response for getting multiple users with pagination
type UsersListResponse struct {
	Users      []*UserResponse `json:"users"`
	TotalCount int
	Limit      int
	Offset     int
}

// CreateUserResponse creates a UserResponse from a database User model
func (ur *UserResponse) CreateUserResponse(user *User, userProfile *UserProfile) {
	// Basic user fields
	ur.ID = user.KeycloakUserID
	ur.Username = user.Username
	ur.Email = user.Email
	ur.Role = string(user.Role)
	ur.IsActive = user.IsActive
	ur.PreferredLanguage = user.PreferredLanguage
	ur.CreatedDate = user.CreatedAt
	ur.UpdatedDate = user.UpdatedAt
	ur.StartDate = user.StartDate
	ur.EndDate = user.EndDate
	ur.CreatedBy = user.CreatedBy
	ur.UpdatedBy = user.UpdatedBy

	// Always populate profile fields, even if userProfile is nil
	if userProfile != nil {
		ur.Profile = UserProfileResponse{
			FirstName:              userProfile.FirstName,
			LastName:               userProfile.LastName,
			FullName:               userProfile.FullName,
			PhoneNumber:            userProfile.PhoneNumber,
			AdhaarNo:               userProfile.AdhaarNo,
			Gender:                 userProfile.Gender,
			Guardian:               userProfile.Guardian,
			GuardianType:           userProfile.GuardianType,
			DateOfBirth:            userProfile.DateOfBirth,
			Department:             userProfile.Department,
			Designation:            userProfile.Designation,
			WorkLocation:           userProfile.WorkLocation,
			ProfilePicture:         userProfile.ProfilePicture,
			RelationshipToProperty: userProfile.RelationshipToProperty,
			OwnershipShare:         userProfile.OwnershipShare,
			IsPrimaryOwner:         userProfile.IsPrimaryOwner,
			IsVerified:             userProfile.IsVerified,
			Address:                &Address{},
		}
	}
}

func CreateUserFromRequest(req *CreateUserRequest, keycloakUserID string) (*User, error) {
	if req.Username == "" || req.Email == "" {
		return nil, fmt.Errorf("username and email are required")
	}
	return &User{
		KeycloakUserID:    keycloakUserID,
		Username:          req.Username,
		Email:             req.Email,
		Role:              req.Role,
		PreferredLanguage: req.PreferredLanguage,
		IsActive:          true,
		StartDate:         req.StartDate,
		EndDate:           req.EndDate,
		CreatedBy:         req.CreatedBy,
		UpdatedBy:         req.UpdatedBy,
	}, nil
}

// CreateUserProfileFromRequest creates a UserProfile from UserProfileRequest
func CreateUserProfileFromRequest(req *UserProfileRequest, userID string) *UserProfile {
	return &UserProfile{
		ID:                     userID, // Use the same ID as user (KeycloakUserID)
		FirstName:              req.FirstName,
		LastName:               req.LastName,
		FullName:               req.FullName,
		PhoneNumber:            req.PhoneNumber,
		AdhaarNo:               req.AdhaarNo,
		Gender:                 req.Gender,
		RelationshipToProperty: req.RelationshipToProperty,
		OwnershipShare:         req.OwnershipShare,
		IsPrimaryOwner:         req.IsPrimaryOwner,
		Department:             req.Department,
		Designation:            req.Designation,
		IsVerified:             false,
	}
}
