
/**
 * Represents a property item in the application inbox.
 */
export interface InboxProperty {
  id: number;            // Unique identifier for the inbox property
  propertyName: string;  // Name of the property
  propertyId: string;    // Property ID
  address: string;       // Full address of the property
  ward: string;          // Ward number or name
  zone: string;          // Zone number or name
  agentName: string;     // Name of the assigned agent
  priority: string;      // Priority level (e.g., LOW, MEDIUM, HIGH)
  isNew: boolean;        // Whether the property is new in the inbox
  dueDate: string;       // Due date for the property/application
}