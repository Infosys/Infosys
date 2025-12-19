// bills.ts
// TypeScript interfaces for representing property bills, bill history, and related data structures for Citizen features.
// Add Bills interface for billsByProperty index signature
// Main structure for bills data, including properties and bills grouped by property
export interface Bills {
  properties: Property[];
  billsByProperty: {
    [key: string]: Bill[];
  };
}
// Property details for which bills are managed
export interface Property {
  id: number;
  name: string;
  address: string;
}

// Bill details for a property (paid/unpaid)
export interface Bill {
  type: 'paid' | 'unpaid';
  billName: string;
  amount?: number;
  address: string;
  dueDate?: string;
  paidDate?: string;
  overdue?: boolean;
}



// Bill history for a specific month
export interface BillHistoryMonth {
  month: string;
  bills: {
    name: string;
    date: string;
    amount: number;
  }[];
}

// Complete bill history, including highlighted bill and monthly breakdown
export interface BillHistory {
  highlighted: {
    billName: string;
    amount: number;
    actions: string[];
  };
  history: BillHistoryMonth[];
}