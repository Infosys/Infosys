// This file defines TypeScript interfaces for reviewed property data in Agent workflows.
// Used for typing lists of properties that have been reviewed by the agent.
import type { Property } from "../../../../models/Citizen/Property";

// Main data structure for reviewed properties
export interface ReviewedPropertyData {
    reviewedProperties: Property[];
}