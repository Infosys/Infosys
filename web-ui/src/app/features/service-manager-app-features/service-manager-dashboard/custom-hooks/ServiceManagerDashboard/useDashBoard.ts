// import { useState, useEffect, useCallback } from 'react';
// import { DashboardService, type DashboardData } from '../../services/ServiceManagerDashboardService';
// import type { ApplicationModel } from '../../models/ServiceManagerDashboard/PropertyApplicationModel';
// import type { AgentModel } from '../../models/ServiceManagerDashboard/Agent_Model';
// import type { Zone, Jurisdiction } from '../../services/ServiceManagerDashboardService';

// interface DashboardStats {
//   totalApplications: number;
//   highPriorityApplications: number;
//   totalAgents: number;
//   onlineAgents: number;
//   availableAgents: number;
//   totalCases: number;
//   averageCases: number;
// }

// export const useDashboard = (zoneFilter?: string) => {
//   const [applications, setApplications] = useState<ApplicationModel[]>([]);
//   const [agents, setAgents] = useState<AgentModel[]>([]);
//   const [zones, setZones] = useState<Zone[]>([]);
//   const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fetch dashboard data
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [dashboardData, dashboardStats] = await Promise.all([
//         DashboardService.getDashboardData(zoneFilter),
//         DashboardService.getDashboardStats(),
//       ]);

//       setApplications(dashboardData.applications);
//       setAgents(dashboardData.agents);
//       setZones(dashboardData.zones);
//       setJurisdiction(dashboardData.jurisdiction);
//       setStats(dashboardStats);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   }, [zoneFilter]);

//   // Refresh dashboard data
//   const refresh = useCallback(async () => {
//     try {
//       setRefreshing(true);
//       setError(null);

//       const [dashboardData, dashboardStats] = await Promise.all([
//         DashboardService.refreshDashboard(zoneFilter),
//         DashboardService.getDashboardStats(),
//       ]);

//       setApplications(dashboardData.applications);
//       setAgents(dashboardData.agents);
//       setZones(dashboardData.zones);
//       setJurisdiction(dashboardData.jurisdiction);
//       setStats(dashboardStats);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to refresh dashboard data');
//     } finally {
//       setRefreshing(false);
//     }
//   }, [zoneFilter]);

//   // Initial fetch
//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   return {
//     // Data
//     applications,
//     agents,
//     zones,
//     jurisdiction,
//     stats,

//     // States
//     loading,
//     error,
//     refreshing,

//     // Actions
//     refresh,
//   };
// };