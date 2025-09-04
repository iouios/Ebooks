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
}

const columns = [
  { id: "เวลา", label: "เวลา", minWidth: 170 },
  { id: "ประเภท", label: "ประเภท", minWidth: 170 },
  { id: "ผู้ใช้", label: "ผู้ใช้", minWidth: 170 },
  { id: "จำนวน", label: "จำนวน", minWidth: 170 },
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
  const [details, setdetails] = React.useState<Details[]>([]);

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
        setdetails(data.token_log);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchdetails();
  }, []);

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <Navbar>
          <Ebook>TransactionData</Ebook>
          <ButtonRow>
          </ButtonRow>
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
                  {details
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
                        <TableCell>{details.type}</TableCell>
                        <TableCell>{details.uid}</TableCell>
                        <TableCell>{toDateString(details.timestamp)}</TableCell>
                        <TableCell>{details.amount}</TableCell>

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
