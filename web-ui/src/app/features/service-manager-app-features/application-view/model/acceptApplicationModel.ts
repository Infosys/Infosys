
// This file defines types for accept and edit application API requests and responses.
import type { Property } from '../model/applicationByIdModel';


// Response type for accepting an application
export type AcceptApplicationResponse = {
    message: string; // Response message from the API
    success: boolean; // Indicates if the operation was successful
};



// Response type for editing an application
export type EditApplicationResponse = {
    message: string; // Response message from the API
    success: boolean; // Indicates if the operation was successful
    data: Property;   // The updated property data
}


// Request type for editing an application
export type EditApplicationRequest = {
    property: Property; // The property object to update
}