// import { ApplicationModel } from '../models/PropertyApplicationModel';

// const BASE_URL = 'http://localhost:3002';

// export class AllApplicationsService {
//   /**
//    * Fetch all applications from json-server
//    */
//   static async getAllApplications(): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(`${BASE_URL}/allApplications`);
//       console.log('Response:', response);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error fetching all applications:', error);
//       throw error;
//     }
//   }

//   /**
//    * Fetch a single application by ID
//    */
//   static async getApplicationById(id: string): Promise<ApplicationModel | null> {
//     try {
//       const response = await fetch(`${BASE_URL}/allApplications/${id}`);
      
//       if (!response.ok) {
//         if (response.status === 404) {
//           return null;
//         }
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return new ApplicationModel(data);
//     } catch (error) {
//       console.error(`Error fetching application ${id}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Search applications by property name
//    */
//   static async searchApplications(searchTerm: string): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?propertyName_like=${encodeURIComponent(searchTerm)}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error searching applications:', error);
//       throw error;
//     }
//   }

//   /**
//    * Filter applications by status
//    */
//   static async filterByStatus(status: string): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?status=${encodeURIComponent(status)}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error filtering applications by status:', error);
//       throw error;
//     }
//   }

//   /**
//    * Sort applications (newest to oldest or vice versa)
//    */
//   static async getSortedApplications(order: 'asc' | 'desc' = 'desc'): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?_sort=date&_order=${order}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error sorting applications:', error);
//       throw error;
//     }
//   }

//   /**
//    * Paginate applications
//    */
//   static async getPaginatedApplications(
//     page: number = 1,
//     limit: number = 10
//   ): Promise<{ applications: ApplicationModel[]; total: number }> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?_page=${page}&_limit=${limit}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);
      
//       return {
//         applications: data.map((app: any) => new ApplicationModel(app)),
//         total,
//       };
//     } catch (error) {
//       console.error('Error fetching paginated applications:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update application (e.g., assign agent, change priority)
//    */
//   static async updateApplication(
//     id: string,
//     updates: Partial<any>
//   ): Promise<ApplicationModel> {
//     try {
//       const response = await fetch(`${BASE_URL}/allApplications/${id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updates),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return new ApplicationModel(data);
//     } catch (error) {
//       console.error(`Error updating application ${id}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Delete application
//    */
//   static async deleteApplication(id: string): Promise<boolean> {
//     try {
//       const response = await fetch(`${BASE_URL}/allApplications/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return true;
//     } catch (error) {
//       console.error(`Error deleting application ${id}:`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get applications by zone
//    */
//   static async getApplicationsByZone(zone: string): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?fullAddress_like=${encodeURIComponent(zone)}`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error fetching applications by zone:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get overdue applications
//    */
//   static async getOverdueApplications(): Promise<ApplicationModel[]> {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/allApplications?status=Due`
//       );
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data.map((app: any) => new ApplicationModel(app));
//     } catch (error) {
//       console.error('Error fetching overdue applications:', error);
//       throw error;
//     }
//   }
// }