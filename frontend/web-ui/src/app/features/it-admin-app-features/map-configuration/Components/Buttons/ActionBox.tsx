import { Box, IconButton } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { actionBoxContainerSx } from "../../Styles/ButtonsStyle/ActionBoxStyle";

const ActionBox = () => {
  return (
    <Box sx={actionBoxContainerSx}>
      <IconButton>
        <FileDownloadOutlinedIcon sx={{ color: "#000" }} />
      </IconButton>
      <IconButton>
        <EditOutlinedIcon sx={{ color: "#000" }} />
      </IconButton>
      <IconButton color="error">
        <DeleteOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default ActionBox;