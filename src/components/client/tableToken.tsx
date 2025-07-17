"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

type Log = {
  id: string;
  action: string;
  amount: number;
  balance: number;
  timestamp: number; 
  type: string;
  detail: string;
};

interface Column {
  id: "timestamp" | "type"  | "amount" | "detail";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "timestamp",
    label: "เวลา",
    minWidth: 170,
    format: (value: number) =>
      new Date(value).toLocaleString("th-TH", {
        dateStyle: "short",
        timeStyle: "short",
      }),
  },
  { id: "type", label: "ประเภท", minWidth: 100 },
  {
    id: "amount",
    label: "จำนวนที่เติม",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("th-TH"),
  },
  {
    id: "detail",
    label: "รายละเอียด",
    minWidth: 170,
    align: "right",
  },
];

interface Data {
  timestamp: number;
  type: string;
  amount: number;
  detail: string;
}

function createData(
  timestamp: number,
  type: string,
  amount: number,
  detail: string
): Data {
  return { timestamp, type, amount, detail  };
}

const TableToken = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [logs, setLogs] = useState<Log[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.sub) return;
      try {
        const res = await fetch(`/api/tabletoken/${user.sub}`);
        if (!res.ok) {
          throw new Error("Failed to fetch logs");
        }
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("❌ Error loading logs:", err);
      }
    };

    fetchLogs();
  }, [user]);

  const mapLogsToRows = (logs: Log[]): Data[] => {
    return logs.map((log) =>
      createData(log.timestamp, log.type, log.amount, log.detail)
    );
  };

  const mappedRows = mapLogsToRows(logs);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 100]}
        component="div"
        count={mappedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableToken;
