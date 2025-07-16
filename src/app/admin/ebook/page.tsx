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
import Image from "next/image";
import EpubReader from "../components/client/epub";
import Swal from "sweetalert2";
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
  { id: "Delete", label: "Delete", minWidth: 100 },
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

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/deleteEbook/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "ลบไม่สำเร็จ");
        }

        Swal.fire("ลบสำเร็จ!", "ข้อมูล eBook ถูกลบแล้ว", "success");

        // ลบจาก state frontend
        setEbooks((prev) => prev.filter((ebook) => ebook.id !== id));
      } catch (err) {
        console.error("ลบไม่สำเร็จ:", err);
        Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบ eBook ได้", "error");
      }
    }
  };

  React.useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch("/api/ebooktable");
        const data = await res.json();
        setEbooks(data);
      } catch (error) {
        console.error("Error fetching ebooks: ", error);
      }
    };

    fetchEbooks();
  }, []);

  return (
    <Main>
      <div>
        <Navbaradmin />
        <Navbarhead />
      </div>
      <Top>
        <Navbar>
          <Ebook>Ebook</Ebook>
          <ButtonRow>
            <AddButton onClick={handleAddClick}>ADD EBOOK</AddButton>
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
                  {ebooks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ebook) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={ebook.id}
                        onClick={() => handleAddClickTable(ebook)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{ebook.title || "null"}</TableCell>
                        <TableCell>
                          {ebook.price ? ebook.price.toLocaleString() : "ฟรี"}
                        </TableCell>
                        <TableCell>{ebook.authors || "null"}</TableCell>
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
                              <EpubReader url={ebook.ebook_url} />
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
                                style={{ height: "auto", objectFit: "contain" }}
                              />
                            )}
                        </TableCell>
                        <TableCell>
                          <DeleteButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(ebook.id);
                            }}
                          >
                            Delete
                          </DeleteButton>
                        </TableCell>
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

const DeleteButton = styled.button`
  background-color: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #c62828;
  }
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
