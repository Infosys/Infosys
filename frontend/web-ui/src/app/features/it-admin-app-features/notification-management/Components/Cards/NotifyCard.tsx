import { Card, Box, Typography } from "@mui/material";
import AntSwitch from "../SwitchButton/AntSwitch";

interface NotifyCardProps {
  label: string;
  icon: React.ReactNode;
}

const NotifyCard: React.FC<NotifyCardProps> = ({ label, icon }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        px: 2,
        py: 2,
        borderRadius: "16px",
        background: "#f5f5f5",
        boxShadow: "none",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {icon}
        <Typography fontSize={16} fontWeight={400}>{label}</Typography>
      </Box>
      <AntSwitch />
    </Card>
  );
};

export default NotifyCard;