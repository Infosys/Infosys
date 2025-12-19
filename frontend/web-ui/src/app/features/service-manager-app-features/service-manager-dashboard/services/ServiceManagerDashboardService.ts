// import { type Application, ApplicationModel } from '../models/ServiceManagerDashboard/PropertyApplicationModel';
// import { type AgentModel } from '../models/ServiceManagerDashboard/Agent_Model';

// // Base URL for the API
// const API_BASE_URL = 'http://localhost:3002';


// // Custom error class for API errors
// export class ApiError extends Error {
//   status?: number;
//   data?: any;

//   constructor(message: string, status?: number, data?: any) {
//     super(message);
//     this.name = 'ApiError';
//     this.status = status;
//     this.data = data;
//   }
// }

// // Generic fetch wrapper with error handling
// async function fetchWithErrorHandling<T>(
//   url: string,
//   options?: RequestInit
// ): Promise<T> {
//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options?.headers,
//       },
//     });

//     if (!response.ok) {
//       throw new ApiError(
//         `HTTP error! status: ${response.status}`,
//         response.status
//       );
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
//     throw new ApiError(
//       error instanceof Error ? error.message : 'An unknown error occurred'
//     );
//   }
// }

// // Application Services
// export class ApplicationService {
//   // Get all recent applications
//   static async getAllApplications(): Promise<ApplicationModel[]> {
//     const data = await fetchWithErrorHandling<Application[]>(
//       `${API_BASE_URL}/recentApplications`
//     );
//     return data.map(app => new ApplicationModel(app));
//   }

//   // Get application by ID
//   static async getApplicationById(id: string): Promise<ApplicationModel> {
//     const data = await fetchWithErrorHandling<Application>(
//       `${API_BASE_URL}/recentApplications/${id}`
//     );
//     return new ApplicationModel(data);
//   }

//   // Get applications by month
//   static async getApplicationsByMonth(month: string): Promise<ApplicationModel[]> {
//     const data = await fetchWithErrorHandling<Application[]>(
//       `${API_BASE_URL}/recentApplications?month=${month}`
//     );
//     return data.map(app => new ApplicationModel(app));
//   }

//   // Get applications by priority
//   static async getApplicationsByPriority(priority: 'High' | 'Medium' | 'Low'): Promise<ApplicationModel[]> {
//     const data = await fetchWithErrorHandling<Application[]>(
//       `${API_BASE_URL}/recentApplications?priority=${priority}`
//     );
//     return data.map(app => new ApplicationModel(app));
//   }

//   // Create new application
//   static async createApplication(application: Partial<Application>): Promise<ApplicationModel> {
//     const data = await fetchWithErrorHandling<Application>(
//       `${API_BASE_URL}/recentApplications`,
//       {
//         method: 'POST',
//         body: JSON.stringify(application),
//       }
//     );
//     return new ApplicationModel(data);
//   }

//   // Update application
//   static async updateApplication(id: string, application: Partial<Application>): Promise<ApplicationModel> {
//     const data = await fetchWithErrorHandling<Application>(
//       `${API_BASE_URL}/recentApplications/${id}`,
//       {
//         method: 'PATCH',
//         body: JSON.stringify(application),
//       }
//     );
//     return new ApplicationModel(data);
//   }

//   // Delete application
//   static async deleteApplication(id: string): Promise<void> {
//     await fetchWithErrorHandling(
//       `${API_BASE_URL}/recentApplications/${id}`,
//       {
//         method: 'DELETE',
//       }
//     );
//   }

//   // Search applications
//   static async searchApplications(query: string): Promise<ApplicationModel[]> {
//     const data = await fetchWithErrorHandling<Application[]>(
//       `${API_BASE_URL}/recentApplications?q=${encodeURIComponent(query)}`
//     );
//     return data.map(app => new ApplicationModel(app));
//   }
// }

// // Agent Services
// export class AgentService {
//   // Get all agents
//   static async getAllAgents(): Promise<AgentModel[]> {
//     const data = await fetchWithErrorHandling<AgentModel[]>(
//       `${API_BASE_URL}/agents`
//     );
//     return data;
//   }

//   // Get agent by ID
//   static async getAgentById(id: string): Promise<AgentModel> {
//     const data = await fetchWithErrorHandling<AgentModel>(
//       `${API_BASE_URL}/agents/${id}`
//     );
//     return data;
//   }

//   // Get agents by zone
//   static async getAgentsByZone(zone: string): Promise<AgentModel[]> {
//     const data = await fetchWithErrorHandling<AgentModel[]>(
//       `${API_BASE_URL}/agents?zone=${encodeURIComponent(zone)}`
//     );
//     return data;
//   }

//   // Get agents by status
//   static async getAgentsByStatus(status: 'Online' | 'Offline' | 'On Leave'): Promise<AgentModel[]> {
//     const data = await fetchWithErrorHandling<AgentModel[]>(
//       `${API_BASE_URL}/agents?status=${status}`
//     );
//     return data;
//   }

//   // Get available agents
//   static async getAvailableAgents(): Promise<AgentModel[]> {
//     const data = await fetchWithErrorHandling<AgentModel[]>(
//       `${API_BASE_URL}/agents?availability=Available&status=Online`
//     );
//     return data;
//   }

//   // Update agent
//   static async updateAgent(id: string, agent: Partial<AgentModel>): Promise<AgentModel> {
//     const data = await fetchWithErrorHandling<AgentModel>(
//       `${API_BASE_URL}/agents/${id}`,
//       {
//         method: 'PATCH',
//         body: JSON.stringify(agent),
//       }
//     );
//     return data;
//   }

//   // Update agent status
//   static async updateAgentStatus(
//     id: string,
//     status: 'Online' | 'Offline' | 'On Leave'
//   ): Promise<AgentModel> {
//     return this.updateAgent(id, { status } as any);
//   }

//   // Update agent availability
//   static async updateAgentAvailability(
//     id: string,
//     availability: 'Available' | 'Not available'
//   ): Promise<AgentModel> {
//     return this.updateAgent(id, { availability } as any);
//   }

//   // Assign agent to ward
//   static async assignAgentToWard(id: string, ward: string): Promise<AgentModel> {
//     return this.updateAgent(id, { ward });
//   }

//   // Search agents
//   static async searchAgents(query: string): Promise<AgentModel[]> {
//     const data = await fetchWithErrorHandling<AgentModel[]>(
//       `${API_BASE_URL}/agents?q=${encodeURIComponent(query)}`
//     );
//     return data;
//   }
// }

// // Zone Services
// export interface Zone {
//   id: string;
//   name: string;
//   wards: string[];
// }

// export class ZoneService {
//   // Get all zones
//   static async getAllZones(): Promise<Zone[]> {
//     return await fetchWithErrorHandling<Zone[]>(
//       `${API_BASE_URL}/zones`
//     );
//   }

//   // Get zone by ID
//   static async getZoneById(id: string): Promise<Zone> {
//     return await fetchWithErrorHandling<Zone>(
//       `${API_BASE_URL}/zones/${id}`
//     );
//   }

//   // Get zone by name
//   static async getZoneByName(name: string): Promise<Zone | null> {
//     const zones = await this.getAllZones();
//     return zones.find(zone => zone.name === name) || null;
//   }
// }

// // Jurisdiction Services
// export interface Jurisdiction {
//   current: string;
//   available: string[];
// }

// export class JurisdictionService {
//   // Get jurisdiction data
//   static async getJurisdiction(): Promise<Jurisdiction> {
//     return await fetchWithErrorHandling<Jurisdiction>(
//       `${API_BASE_URL}/jurisdiction`
//     );
//   }

//   // Update current jurisdiction
//   static async updateCurrentJurisdiction(jurisdiction: string): Promise<Jurisdiction> {
//     return await fetchWithErrorHandling<Jurisdiction>(
//       `${API_BASE_URL}/jurisdiction`,
//       {
//         method: 'PATCH',
//         body: JSON.stringify({ current: jurisdiction }),
//       }
//     );
//   }
// }

// // Dashboard Service - Combines all data needed for dashboard
// export interface DashboardData {
//   applications: ApplicationModel[];
//   agents: AgentModel[];
//   zones: Zone[];
//   jurisdiction: Jurisdiction;
// }

// export class DashboardService {
//   // Get all dashboard data in a single call
//   static async getDashboardData(zoneFilter?: string): Promise<DashboardData> {
//     try {
//       // Fetch all data in parallel for better performance
//       const [applications, agents, zones, jurisdiction] = await Promise.all([
//         ApplicationService.getAllApplications(),
//         zoneFilter 
//           ? AgentService.getAgentsByZone(zoneFilter)
//           : AgentService.getAllAgents(),
//         ZoneService.getAllZones(),
//         JurisdictionService.getJurisdiction(),
//       ]);

//       return {
//         applications,
//         agents,
//         zones,
//         jurisdiction,
//       };
//     } catch (error) {
//       throw new ApiError(
//         'Failed to fetch dashboard data',
//         undefined,
//         error
//       );
//     }
//   }

//   // Get dashboard statistics
//   static async getDashboardStats() {
//     const [applications, agents] = await Promise.all([
//       ApplicationService.getAllApplications(),
//       AgentService.getAllAgents(),
//     ]);

//     const highPriorityCount = applications.filter(app => app.isHighPriority()).length;
//     const onlineAgentsCount = agents.filter(agent => agent.isActive === true).length;
//     const availableAgentsCount = agents.filter(agent => agent.isActive === true).length;

//     return {
//       totalApplications: applications.length,
//       highPriorityApplications: highPriorityCount,
//       totalAgents: agents.length,
//       onlineAgents: onlineAgentsCount,
//       availableAgents: availableAgentsCount,
//     };
//   }

//   // Refresh dashboard data
//   static async refreshDashboard(zoneFilter?: string): Promise<DashboardData> {
//     return this.getDashboardData(zoneFilter);
//   }
// }

// // Export all services
// export default {
//   ApplicationService,
//   AgentService,
//   ZoneService,
//   JurisdictionService,
//   DashboardService,
// };