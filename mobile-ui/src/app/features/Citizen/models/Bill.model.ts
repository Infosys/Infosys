// Represents a property tax bill
export type Bill = {
  id: string; // Unique bill identifier
  propertyId: string; // Linked property ID
  billNo: string; // Bill number
  billType: string; // Type of bill (e.g., property tax, penalty)
  amount: number; // Bill amount
  status: string; // Bill status (e.g., paid, unpaid)
  dueDate: string; // Due date for payment
  createdAt: string; // Creation timestamp
  updatedAt: string; // Last update timestamp
}