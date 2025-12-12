// Represents a single item in the property ownership or transaction history
export type HistoryItem = {
  id: string; // Unique identifier for the history item
  propertyId: string; // Linked property ID
  ownerName: string; // Name of the owner during this period
  ownershipType: string; // Type of ownership (e.g., freehold, leasehold)
  description: string; // Description of the transaction or change
  periodStart: string; // Start date of this ownership/period
  transactionDate: string; // Date of the transaction
  createdAt: string; // Creation timestamp
}