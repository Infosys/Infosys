
// Represents a geographical location with latitude and longitude
export interface Location {
  lat: number; // Latitude
  lng: number; // Longitude
}


// Represents a status tag with a label and a color variant
export interface StatusTag {
  label: string; // Text to display in the tag
  variant: 'error' | 'success' | 'warning' | 'info'; // Visual style of the tag
}


// Represents a generic tag, e.g., for property or agent
export interface Tag {
  type: string; // Type or label of the tag
}


// Represents an action that can be performed on an application (e.g., assign, set priority)
export interface Action {
  type: 'priority' | 'assign'; // Type of action
  label: string; // Button or action label
  variant?: 'contained' | 'outlined' | 'text'; // Button style
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'; // Button color
}


// Represents detailed information about a property
export interface PropertyDetails {
  ID: string; // Unique property ID
  PropertyNo: string; // Property number
  OwnershipType: string; // Type of ownership
  PropertyType: string; // Type/category of property
  ComplexName: string; // Name of the complex (if any)
  Address: any | null; // Address details (structure may vary)
  AssessmentDetails: any | null; // Assessment-related info
  Amenities: any[]; // List of amenities
  ConstructionDetails: any | null; // Construction-related info
  AdditionalDetails: any | null; // Any extra details
  GISData: any | null; // Geographic Information System data
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp
  Documents: any[]; // Associated documents
}


// Represents a property application as received from the backend
export interface AllApplicationModel {
  ID: string; // Unique application ID
  ApplicationNo: string; // Application number
  PropertyID: string; // Linked property ID
  Priority: string; // Priority level
  TenantID: string; // Tenant identifier
  DueDate: string; // Due date for the application
  AssignedAgent: string | null; // Agent assigned to the application
  Status: string; // Current status
  WorkflowInstanceID: string; // Workflow instance ID
  AppliedBy: string; // User who applied
  AssesseeID: string | null; // Assessee ID (if any)
  Property: PropertyDetails; // Property details object
  ApplicationLogs: any[]; // Logs related to the application
  IsDraft: boolean; // Whether the application is a draft
  CreatedAt: string; // Creation timestamp
  UpdatedAt: string; // Last update timestamp

  AgentName: string; // Name of the assigned agent
  AgentUsername: string; // Username of the assigned agent
}


// ApplicationModel is a frontend-friendly class for handling property application data and related logic
export class ApplicationModel {
  id: string; // Unique application ID
  propertyName: string; // Name of the property
  location: Location; // Geographical location
  fullAddress: string; // Full address as a string
  date: string; // Date string (ISO or similar)
  status: string; // Application status
  statusTag: StatusTag; // Status tag object
  tags: Tag[]; // List of tags (property, agent, etc.)
  actions: Action[]; // List of available actions
  images: (string | null)[]; // Array of image URLs or nulls

  // Constructor initializes the ApplicationModel from a data object
  constructor(data: any) {
    this.id = data.id;
    this.propertyName = data.propertyName;
    this.location = data.location;
    this.fullAddress = data.fullAddress;
    this.date = data.date;
    this.status = data.status || '';
    this.statusTag = data.statusTag;
    this.tags = data.tags || [];
    this.actions = data.actions || [];
    this.images = data.images || [null, null, null]; // Default to 3 empty slots
  }

  // Returns the date in a human-readable format (e.g., 01-Dec-2025)
  getFormattedDate(): string {
    const dateObj = new Date(this.date);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // Returns the time in a human-readable format (e.g., 10:30 AM)
  getFormattedTime(): string {
    const dateObj = new Date(this.date);
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Returns the combined formatted date and time
  getFormattedDateTime(): string {
    return `${this.getFormattedDate()} ${this.getFormattedTime()}`;
  }

  // Returns only the available (non-null) images
  getAvailableImages(): string[] {
    return this.images.filter((img): img is string => img !== null);
  }

  // Checks if there are any images available
  hasImages(): boolean {
    return this.getAvailableImages().length > 0;
  }

  // Returns the count of available images
  getImageCount(): number {
    return this.getAvailableImages().length;
  }

  // Returns the background color for the status tag based on its variant
  getStatusTagColor(): string {
    switch (this.statusTag.variant) {
      case 'error':
        return '#FFE5E5'; // Red background for errors
      case 'success':
        return '#E5F8E5'; // Green background for success
      case 'warning':
        return '#FFF4E5'; // Orange background for warnings
      case 'info':
        return '#E5F4FF'; // Blue background for info
      default:
        return '#F5F5F5'; // Default gray
    }
  }

  // Returns the text color for the status tag based on its variant
  getStatusTagTextColor(): string {
    switch (this.statusTag.variant) {
      case 'error':
        return '#D32F2F'; // Red text for errors
      case 'success':
        return '#2E7D32'; // Green text for success
      case 'warning':
        return '#ED6C02'; // Orange text for warnings
      case 'info':
        return '#0288D1'; // Blue text for info
      default:
        return '#666'; // Default gray
    }
  }

  // Checks if the application is overdue (status is 'Due' or error variant)
  isOverdue(): boolean {
    return this.status === 'Due' || this.statusTag.variant === 'error';
  }

  // Returns the first action as the primary action, or null if none
  getPrimaryAction(): Action | null {
    return this.actions.length > 0 ? this.actions[0] : null;
  }

  // Returns the second action as the secondary action, or null if not present
  getSecondaryAction(): Action | null {
    return this.actions.length > 1 ? this.actions[1] : null;
  }

  // Checks if an agent is assigned by looking for a tag containing 'agent'
  isAgentAssigned(): boolean {
    return this.tags.some(tag => tag.type.toLowerCase().includes('agent'));
  }

  // Returns the assigned agent's name if present, otherwise null
  getAssignedAgent(): string | null {
    const agentTag = this.tags.find(tag => tag.type.toLowerCase().includes('agent'));
    return agentTag ? agentTag.type : null;
  }

  // Returns all property tags except those related to agents
  getPropertyTags(): Tag[] {
    return this.tags.filter(tag => !tag.type.toLowerCase().includes('agent'));
  }
}