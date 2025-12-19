import { Box, Card, IconButton, Typography } from "@mui/material"
import { ToggleCardContainerSx } from "../../Styles/CardsStyle/ToggleCardStyle"
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined"
import AntSwitch from "../SwitchButton/AntSwitch";

interface ToggleCardProps {
    label: string;
    toggled: boolean;
    onToggle: (value: boolean) => void;
    sx?: object;
}

const ToggleCard = ({ label, toggled, onToggle, sx }: ToggleCardProps) => {
  return (
    <Card sx={{ ...ToggleCardContainerSx, ...sx }}>
      <IconButton onClick={() => onToggle(!toggled)}>
        {toggled ? (
          <VisibilityOutlinedIcon sx={{ color: "#888" }} />
        ) : (
          <VisibilityOffOutlinedIcon sx={{ color: "#888" }} />
        )}
      </IconButton>
      <Box>
        <Typography fontSize={14} fontWeight={500}>{label}</Typography>
        <Typography fontSize={12} fontWeight={300}>Visible on Map</Typography>
      </Box>

      <AntSwitch
        checked={toggled}
        onChange={(_, checked) => onToggle(checked)}
        color="primary"
        sx={{ mx: 1 }}
      />
    </Card>
  )
}

export default ToggleCard