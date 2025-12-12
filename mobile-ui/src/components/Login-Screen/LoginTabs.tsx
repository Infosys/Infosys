
// LoginTabs.tsx
// Renders tab buttons for switching between agent and citizen login modes.
// Highlights the selected tab and uses localization for labels.
import { Box, Button } from "@mui/material";

const PRIMARY_ORANGE = "#C84C0E";


// Props for LoginTabs component
type Props = {
  selected: "agent" | "citizen";
  onChange: (tab: "agent" | "citizen") => void;
  t : (code: string, fallback?: string) => string;
};


/**
 * LoginTabs component
 * Renders two tab buttons for agent and citizen login, highlights the selected tab, and calls onChange when switched.
 */
export default function LoginTabs({ selected, onChange, t }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        background: "#E5E5E5",
        height: "42px",
        borderRadius: "10px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Agent tab button */}
      <Button
        disableRipple
        onClick={() => onChange("agent")}
        sx={{
          flex: 1,
          background: selected === "agent" ? PRIMARY_ORANGE : "#E5E5E5",
          color: selected === "agent" ? "#fff" : "#222",
          fontWeight: selected === "agent" ? 700 : 400,
          fontSize: "1rem",
          border: "none",
          borderRadius: selected === "agent" ? "10px" : "10px",
          transition: "background .2s, color .2s, font-weight .2s",
          textTransform: "none",
          py: 1.2,
          boxShadow: "none",
          fontFamily: "Roboto, sans-serif",
          '&:hover': {
            background: selected === "agent" ? PRIMARY_ORANGE : "#E5E5E5",
          },
          // Remove the focus outline and background change (no black border!)
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
            border: 'none',
          }
        }}
      >
        {t("field-agent","Field Agent")}
      </Button>
      {/* Citizen tab button */}
      <Button
        disableRipple
        onClick={() => onChange("citizen")}
        sx={{
          flex: 1,
          background: selected === "citizen" ? PRIMARY_ORANGE : "#E5E5E5",
          color: selected === "citizen" ? "#fff" : "#222",
          fontWeight: selected === "citizen" ? 600 : 300,
          fontSize: "1rem",
          border: "none",
          borderRadius: selected === "citizen" ? "10px" : "10px",
          transition: "background .2s, color .2s, font-weight .2s",
          textTransform: "none",
          py: 1.2,
          boxShadow: "none",
          fontFamily: "Roboto, sans-serif",
          '&:hover': {
            background: selected === "citizen" ? PRIMARY_ORANGE : "#E5E5E5",
          },
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
            border: 'none',
          }
        }}
      >
        {t("citizen","Citizen")}
      </Button>
    </Box>
  );
}