"use client";
import styled from "styled-components";
import Navbaradmin from "../components/client/Navbaradmin";
import Navbarhead from "../components/client/Navbarhead";
import * as React from "react";
import { useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";

interface EbookData {
  birth_year: string;
  name: string;
  id: string;
}

const columns = [
  { id: "Name", label: "Name", minWidth: 170 },
  { id: "birth_year", label: "birth_year", minWidth: 170 },
];

const Create = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [ebooks, setEbooks] = React.useState<EbookData[]>([]);

  const router = useRouter();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddClick = () => {
    router.push("/admin/author/create");
  };

  const handleAddClickTable = async (ebook: EbookData) => {
    router.push(`/admin/author/edit/${ebook.id}`);
  };

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch("/api/authors");
        const data = await res.json();
        setEbooks(data);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchEbooks();
  }, []);

  console.log("ebook data:", ebooks);

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <ButtonRow>
          <AddButton onClick={handleAddClick}>ADD EBOOK</AddButton>
        </ButtonRow>
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
                  {ebooks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ebook) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={ebook.id}
                        onClick={() => handleAddClickTable(ebook)}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <TableCell>{ebook.name || "null"}</TableCell>
                        <TableCell>{ebook.birth_year}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={ebooks.length}
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

export default Create;

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

const AddButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #1565c0;
  }
`;

const Content = styled.div`
  width: 100%;
  margin-top: 2rem;
`;
