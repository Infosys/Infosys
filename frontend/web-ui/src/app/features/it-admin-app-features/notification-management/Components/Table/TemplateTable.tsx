import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";
import { columns, rows } from "../../Utils/TemplateTableUtil";
import CustomChip from "../Buttons/CustomChip";
import ActionBox from "../Buttons/ActionBox";
import { textWrapSx, tableContainerSx, chipWrapSx } from "../../Styles/TableStyle/TemplateTableStyle";

const TemplateTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={tableContainerSx}
    >
      <Table stickyHeader>
        {/* Table Header */}
        <TableHead sx={{ backgroundColor: "#F8F8F8" }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align="center" sx={{ backgroundColor: "#F8F8F8" }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table body */}
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              {/* Template Name */}
              <TableCell align="center" sx={textWrapSx}>
                {row.templateName}
              </TableCell>
              {/* Channels */}
              <TableCell align="center">
                <Box sx={chipWrapSx}>
                  {row.channels.map((channel: string, i: number) => (
                    <CustomChip
                      key={i}
                      label={channel}
                      color="#000"
                      borderColor="#000"
                      backgroundColor="#fff"
                    />
                  ))}
                </Box>
              </TableCell>
              {/* Type */}
              <TableCell align="center">
                <CustomChip
                  label={row.type}
                  color="#000"
                  borderColor="#000"
                  backgroundColor="#fff"
                />
              </TableCell>
              {/* Role */}
              <TableCell align="center">
                <Box sx={chipWrapSx}>
                  {row.role.map((role: string, i: number) => (
                    <CustomChip
                      key={i}
                      label={role}
                      color="#000"
                      borderColor="#000"
                      backgroundColor="#fff"
                    />
                  ))}
                </Box>
              </TableCell>
              {/* Last Used */}
              <TableCell align="center">
                <Typography variant="body2">{row.lastUsed}</Typography>
              </TableCell>
              {/* Status */}
              <TableCell align="center">
                <CustomChip
                  label={row.status}
                  color="#00703c"
                  borderColor="#00703c"
                  backgroundColor="#dbfad3"
                />
              </TableCell>
              {/* Action */}
              <TableCell align="center">
                <ActionBox />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateTable;