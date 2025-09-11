"use client";
import styled from "styled-components";
import Navbaradmin from "../components/client/Navbaradmin";
import Navbarhead from "../components/client/Navbarhead";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";

interface Details {
  uid: string;
  type: string;
  timestamp: { _seconds: number };
  amount: number;
  id: string;
  sessionId: string;
  paymentMethod: string;
  balance: number;
  email?: string;
}

const columns = [
  { id: "Log ID", label: "Log ID", minWidth: 170 },
  { id: "Session ID", label: "Session ID", minWidth: 170 },
  { id: "User ", label: "User ", minWidth: 170 },
  { id: "Token", label: "Token", minWidth: 170 },
  { id: "Price", label: "Price", minWidth: 170 },
  { id: "Payment method", label: "Payment method", minWidth: 170 },
  { id: "Created At", label: "Created At", minWidth: 170 },
];

function toDateString(timestamp: { _seconds: number; _nanoseconds?: number }) {
  if (!timestamp?._seconds) return "-";
  const millis =
    timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1e6;
  return new Date(millis).toLocaleString("th-TH");
}

const TransactionData = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [details, setDetails] = React.useState<Details[]>([]);
  const [searchEmail, setSearchEmail] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [filteredLogs, setFilteredLogs] = React.useState<Details[]>([]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const res = await fetch("/api/transactionData");
        const data = await res.json();
        const depositLogs = data.token_log.filter(
          (log: { type: string }) => log.type === "deposit"
        );

        setDetails(depositLogs);
        setFilteredLogs(depositLogs);
      } catch (error) {
        console.error("Error fetching transaction logs:", error);
      }
    };

    fetchdetails();
  }, []);

  const handleSearch = () => {
    let tempLogs = [...details];

    if (searchEmail.trim() !== "") {
      tempLogs = tempLogs.filter((log) =>
        (log.email || "").toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (startDate) {
      tempLogs = tempLogs.filter((log) => {
        const logDate = new Date(log.timestamp._seconds * 1000);
        console.log(
          "Checking log:",
          logDate,
          ">= StartDate:",
          new Date(startDate)
        );
        return logDate >= new Date(startDate);
      });
    }

    if (endDate) {
      tempLogs = tempLogs.filter((log) => {
        const logDate = new Date(log.timestamp._seconds * 999);
        console.log("Checking log:", logDate, "<= EndDate:", new Date(endDate));
        return logDate <= new Date(endDate);
      });
    }

    console.log("Filtered result:", tempLogs);
    setFilteredLogs(tempLogs);
  };

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <Navbar>
          <Ebook>TransactionData</Ebook>
          <FilterBar>
            <input
              type="text"
              placeholder="Search by user email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </FilterBar>

          <ButtonRow></ButtonRow>
        </Navbar>
        <Content>
          <Paper>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((details) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={details.id}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>{details.id}</TableCell>
                        <TableCell>{details.sessionId}</TableCell>
                        <TableCell>{details.email}</TableCell>
                        <TableCell>{details.amount}</TableCell>
                        <TableCell>{details.amount}</TableCell>
                        <TableCell>{details.paymentMethod}</TableCell>
                        <TableCell>{toDateString(details.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={details.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Content>
      </Top>
    </Main>
  );
};

export default TransactionData;

const Main = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`;

const Top = styled.div`
  margin-top: 60px;
  width: 70%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const Navbar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const Ebook = styled.div`
  font-size: 36px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  align-items: center;

  input {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 14px;
  }

  button {
    padding: 8px 16px;
    background-color: #0070f3;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;

    &:hover {
      background-color: #005bb5;
    }
  }
`;
