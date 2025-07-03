"use client"
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
import Image from "next/image";
import EpubReader from "../components/client/epub";

interface EbookData {
  ebook_url: string;
  image_url: string;
  id: string;
  title: string;
  authors: string;
  summaries: string;
  bookshelves: string[];
  languages: string[];
  price: number;
}

const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  { id: "price", label: "price", minWidth: 170 },
  { id: "authors", label: "Authors", minWidth: 150 },
  { id: "summaries", label: "Summary", minWidth: 200 },
  { id: "bookshelves", label: "Bookshelves", minWidth: 150 },
  { id: "languages", label: "Languages", minWidth: 100 },
  { id: "ebook", label: "Ebook", minWidth: 100 },
  { id: "cover", label: "Cover", minWidth: 100 },
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
    router.push("/admin/ebook/create");
  };

  const handleAddClickTable = async (ebook: EbookData) => {
    router.push(`/admin/ebook/edit/${ebook.id}`);
  };

  React.useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch("/api/ebooktable");
        console.log("API Response Status: ", res.status); 
        const data = await res.json();
        console.log("API Response Data: ", data); 
        setEbooks(data);
      } catch (error) {
        console.error("Error fetching ebooks: ", error);
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
<<<<<<< HEAD
                  {ebooks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ebook) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={ebook.id}
                      onClick={() => handleAddClickTable(ebook)}
                    >
                      <TableCell>{ebook.title || "Not Available"}</TableCell>
                      <TableCell>{ebook.authors || "Not Available"}</TableCell>
                      <TableCell>{ebook.summaries || "No summary"}</TableCell>
                      <TableCell>
                        {Array.isArray(ebook.bookshelves)
                          ? ebook.bookshelves.join(", ")
                          : "No bookshelves"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(ebook.languages)
                          ? ebook.languages.join(", ")
                          : "No languages"}
                      </TableCell>
                      <TableCell>
                        {ebook.ebook_url && (
                          <iframe
                            src={ebook.ebook_url}
                            width="100"
                            height="100"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {ebook.image_url &&
                          /\.(jpg|jpeg|png)$/i.test(ebook.image_url) && (
                            <Image
                              src={ebook.image_url}
                              alt="ebook image"
                              width={100}
                              height={150}
                              style={{
                                height: "auto",
                                objectFit: "contain",
                              }}
                            />
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
=======
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
                        <TableCell>{ebook.title || "null"}</TableCell>
                        <TableCell>{ebook.price ? ebook.price.toLocaleString() : "ฟรี"}</TableCell>
                        <TableCell>{ebook.summaries || "null"}</TableCell>
                        <TableCell>{ebook.summaries || "null"}</TableCell>
                        <TableCell>
                          {Array.isArray(ebook.bookshelves)
                            ? ebook.bookshelves.join(", ")
                            : "null"}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(ebook.languages)
                            ? ebook.languages.join(", ")
                            : "null"}
                        </TableCell>
                        <TableCell>
                          {ebook.ebook_url &&
                            (ebook.ebook_url.toLowerCase().endsWith(".epub") ? (
                              <EpubReader
                                url={ebook.ebook_url}
                                style={{
                                  width: "100px",
                                  height: "150px",
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                  margin: "0 auto",
                                }}  
                              />
                            ) : (
                              <iframe
                                src={ebook.ebook_url}
                                width="100"
                                height="150"
                                style={{
                                  border: "1px solid #ccc",
                                  borderRadius: "8px",
                                }}
                              />
                            ))}
                        </TableCell>
                        <TableCell>
                          {ebook.image_url &&
                            /\.(jpg|jpeg|png)$/i.test(ebook.image_url) && (
                              <Image
                                src={ebook.image_url}
                                alt="ebook image"
                                width={100}
                                height={150}
                                style={{
                                  height: "auto",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                        </TableCell>
                      </TableRow>
                    ))}
>>>>>>> master
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
