/**
 * This component renders a filter form for the property application inbox.
 * It allows filtering by agent, ward, and priority, and applies the selected filters to the Redux store.
 */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import TextButton from '../ApplicationInboxButtons/TextButton'
import { applyFilterButtonSx } from '../../styles/ApplicationInboxButtons/TextButtonStyle'
import { DividerSx, filterButtonContainerSx } from '../../styles/PropertyFilter/PropertyFilterStyle'
import MultiSelectAutocomplete from '../FilterComponents/MultiSelectAutocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { setAgents, setPriority, setWards } from '../../store/filterSlice'
import { useGetAllAgentsQuery } from '../../api/getAllAgentsApi'
import React, { useState, useEffect } from 'react'
import Chip from "@mui/material/Chip";
import Stack from '@mui/material/Stack'
import type { RootState } from '../../../../../../store'

// Type definition for a zone, which includes a zone number and a list of wards in that zone
interface ZoneData {
  zoneNumber: string;
  wards: string[];
}

// Props for the PropertyFilter component
interface PropertyFilterProps {
  onClose?: () => void; // Optional handler to close the filter dialog
}

// Priority options for filtering
const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" }
];

// Functional component to render the property filter form
const PropertyFilter: React.FC<PropertyFilterProps> = ({ onClose }) => {
  // Agent filter state and options
  const { data: agentsData, isLoading: agentsLoading } = useGetAllAgentsQuery()
  const agentOptions = agentsData?.data?.users?.map(agent => agent.profile?.fullName) || []
  const agentsFilterRedux = useSelector((state: RootState) => state.filter.agents)
  // Restrict to single agent selection
  const [selectedAgent, setSelectedAgent] = useState<string>(agentsFilterRedux[0] ?? "")
  useEffect(() => { setSelectedAgent(agentsFilterRedux[0] ?? "") }, [agentsFilterRedux])

  // Priority filter (single selection)
  const priority = useSelector((state: RootState) => state.filter.priority)
  const dispatch = useDispatch()

  // Ward filter state (single selection)
  const selectedZone = useSelector((state: RootState) => state.user.selectedZone);
  const assignedZones: ZoneData[] = Array.isArray(selectedZone) ? selectedZone : selectedZone ? [selectedZone] : [];
  const wardOptions = assignedZones.flatMap(z => z.wards);
  const wardsFilterRedux = useSelector((state: RootState) => state.filter.wards);
  const [selectedWard, setSelectedWard] = useState<string>(wardsFilterRedux[0] ?? "");
  useEffect(() => { setSelectedWard(wardsFilterRedux[0] ?? ""); }, [wardsFilterRedux]);

  // Apply the selected filters to the Redux store
  const handleApply = () => {
    dispatch(setAgents(selectedAgent ? [selectedAgent] : []))
    dispatch(setPriority(priority))
    dispatch(setWards(selectedWard ? [selectedWard] : []))
    if (onClose) onClose();
  }

  // Handle priority chip click to toggle selection
  const handlePriorityChipClick = (value: string) => {
    dispatch(setPriority(priority === value ? '' : value));
  };

  // Handle ward chip click to select only one ward
  const handleWardChipClick = (ward: string) => {
    setSelectedWard(prev => prev === ward ? "" : ward);
  };

  return (
    <Box>
      {/* Agent filter section */}
      <Typography fontSize={20} fontWeight={300}>Agent</Typography>
      <MultiSelectAutocomplete
        options={agentOptions}
        value={selectedAgent ? [selectedAgent] : []}
        onChange={arr => setSelectedAgent(arr[0] ?? "")}
        placeholder="Search agent..."
        loading={agentsLoading}
        // If your MultiSelectAutocomplete supports maxSelections, you can add: maxSelections={1}
      />
      <Divider sx={DividerSx} />

      {/* Ward filter section as chips (single select) */}
      <Typography fontSize={20} fontWeight={300} mb={1}>Ward</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        {wardOptions.map((ward: string) => (
          <Chip
            key={ward}
            label={ward}
            clickable
            onClick={() => handleWardChipClick(ward)}
            color={selectedWard === ward ? "primary" : "default"}
            variant={selectedWard === ward ? "filled" : "outlined"}
            sx={{
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 14,
              bgcolor: selectedWard === ward ? "#c84c03" : undefined,
              color: selectedWard === ward ? "#fff" : undefined,
              borderColor: selectedWard === ward ? "#c84c03" : undefined,
              '&:hover': {
                bgcolor: selectedWard === ward ? "#a63e02" : undefined,
              },
            }}
          />
        ))}
      </Stack>
      <Divider sx={DividerSx} />

      {/* Priority filter section */}
      <Typography fontSize={20} fontWeight={300} mb={1}>Priority</Typography>
      <Stack direction="row" spacing={2} mb={2}>
        {priorityOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            clickable
            onClick={() => handlePriorityChipClick(option.value)}
            color={priority === option.value ? "primary" : "default"}
            variant={priority === option.value ? "filled" : "outlined"}
            sx={{
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 14,
              bgcolor: priority === option.value ? "#c84c03" : undefined,
              color: priority === option.value ? "#fff" : undefined,
              borderColor: priority === option.value ? "#c84c03" : undefined,
              '&:hover': {
                bgcolor: priority === option.value ? "#a63e02" : undefined,
              },
            }}
          />
        ))}
      </Stack>

      {/* Apply filter button */}
      <Box sx={filterButtonContainerSx}>
        <TextButton text={"Apply Filter"} sx={applyFilterButtonSx} onClick={handleApply} />
      </Box>
    </Box>
  )
}

export default PropertyFilter