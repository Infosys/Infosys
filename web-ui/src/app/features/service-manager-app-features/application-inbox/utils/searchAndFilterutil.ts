
// Utility functions for searching, filtering, and enriching application inbox data.
import type { AllApplicationModel } from "../models/getAllApplicationsModel";


/**
 * Represents an agent with optional profile and username fields.
 */
interface Agent {
  id: string; // Unique agent ID
  profile?: {
    fullName?: string; // (Optional) Full name of the agent
  };
  username?: string; // (Optional) Username of the agent
}


/**
 * Represents the structure of agents data returned from the backend.
 */
interface AgentsData {
  data?: {
    users?: Agent[]; // (Optional) List of agent users
  };
}


/**
 * Builds a mapping from agent ID to agent full name.
 * @param agentsData - The agents data object
 * @returns Record mapping agent IDs to names
 */
export function buildAgentIdToNameMap(agentsData: AgentsData): Record<string, string> {
  const map: Record<string, string> = {};
  if (agentsData?.data?.users) {
    agentsData.data.users.forEach((agent) => {
      map[agent.id] = agent.profile?.fullName || "N/A"; // Use full name or fallback to 'N/A'
    });
  }
  return map;
}


/**
 * Builds a mapping from agent ID to agent username.
 * @param agentsData - The agents data object
 * @returns Record mapping agent IDs to usernames
 */
export function buildAgentIdToUsernameMap(agentsData: AgentsData): Record<string, string> {
  const map: Record<string, string> = {};
  if (agentsData?.data?.users) {
    agentsData.data.users.forEach((agent) => {
      map[agent.id] = agent.username || "N/A"; // Use username or fallback to 'N/A'
    });
  }
  return map;
}


/**
 * Adds the agent's name to each property in the list, based on the agent ID.
 * @param properties - List of application models
 * @param agentIdToName - Mapping from agent ID to agent name
 * @returns List of application models with agentName field populated
 */
export function enrichPropertiesWithAgentName(
  properties: AllApplicationModel[],
  agentIdToName: Record<string, string>
): AllApplicationModel[] {
  return properties.map(property => ({
    ...property,
    agentName: agentIdToName[property.AssignedAgent ?? ""] || "N/A",
  }));
}


/**
 * Adds the agent's username to each property in the list, based on the agent ID.
 * @param properties - List of application models
 * @param agentIdToUsername - Mapping from agent ID to agent username
 * @returns List of application models with agentUsername field populated
 */
export function enrichPropertiesWithAgentUsername(
  properties: AllApplicationModel[],
  agentIdToUsername: Record<string, string>
): AllApplicationModel[] {
  return properties.map(property => ({
    ...property,
    agentUsername: agentIdToUsername[property.AssignedAgent ?? ""] || "N/A",
  }));
}


/**
 * Filters the list of properties based on agent, priority, zone, and search value.
 * Only properties with Status 'ASSIGNED' are included.
 *
 * @param properties - List of application models
 * @param agentsFilter - List of agent names to filter by
 * @param searchValue - Search string to filter by various fields
 * @param zonesFilter - List of zone numbers to filter by
 * @param priority - Priority value to filter by
 * @returns Filtered list of application models
 */
export function filterProperties(
  properties: AllApplicationModel[],
  agentsFilter: string[] = [],
  searchValue: string = "",
  zonesFilter: string[] = [],
  priority: string = ""
) {
  return properties
    .filter(property => property.Status === "ASSIGNED") // Only include assigned properties
    .filter(property => {
      // Agent filter (by agent name)
      if (agentsFilter.length > 0 &&
        !agentsFilter.some(agent => property.agentName === agent)) {
        return false;
      }

      // Priority filter (single selection)
      if (priority && property.Priority !== priority) {
        return false;
      }

      // Zone filter (by ZoneNo, case insensitive)
      if (zonesFilter && zonesFilter.length > 0) {
        const propertyZone = property.Property.Address?.ZoneNo?.toString().toLowerCase();
        if (!zonesFilter.some(zone => zone.toLowerCase() === propertyZone)) {
          return false;
        }
      }

      // Search filter (matches against several fields)
      if (searchValue && searchValue.length > 0) {
        const lcSearch = searchValue.toLowerCase();
        const fieldsToSearch = [
          property.agentName,
          property.agentUsername,
          property.ApplicationNo,
          property.Property.PropertyNo,
          property.Property.Address?.Locality,
          property.Property.Address?.Street
        ];
        if (!fieldsToSearch.some(field =>
          (field || '').toString().toLowerCase().includes(lcSearch)
        )) {
          return false;
        }
      }

      return true; // Include property if all filters pass
    });
}


/**
 * Calculates the total number of pages for pagination.
 * @param totalItems - Total number of items
 * @param pageSize - Number of items per page
 * @returns Total number of pages (minimum 1)
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.max(Math.ceil(totalItems / pageSize), 1);
}