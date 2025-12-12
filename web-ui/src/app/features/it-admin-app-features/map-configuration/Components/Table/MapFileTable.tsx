import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { columns, rows } from "../../Utils/MapFileTableUtil";
import CustomChip from "../Buttons/CustomChip";
import ActionBox from "../Buttons/ActionBox";
import { textWrapSx, tableContainerSx } from "../../Styles/TableStyle/MapFileTableStyle";
import TablePaginationControls from "../../../components/TablePagination";

const MapFileTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={tableContainerSx}>
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
          {paginatedRows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell align="center" sx={textWrapSx}>{row.fileName}</TableCell>
              <TableCell align="center">
                <CustomChip
                  label={row.type}
                  color="#000000"
                  borderColor="#000000"
                  backgroundColor="#ffffff"
                />
              </TableCell>
              <TableCell align="center" sx={textWrapSx}>{row.features}</TableCell>
              <TableCell align="center">{row.size}</TableCell>
              <TableCell align="center" sx={textWrapSx}>{row.uploadedBy}</TableCell>
              <TableCell align="center">
                <CustomChip
                  label={row.status}
                  color="#000000"
                  borderColor="#00703c"
                  backgroundColor="#dbfad3"
                />
              </TableCell>
              <TableCell align="center">
                <ActionBox />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePaginationControls
        count={rows.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default MapFileTable;