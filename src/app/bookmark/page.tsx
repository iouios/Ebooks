"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Author {
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  languages: string[];
  subjects: string[];
  download_count: number;
  summaries: string[];
  bookshelves: string[];
  formats: {
    "text/plain"?: string;
    "application/epub+zip"?: string;
    "image/jpeg"?: string;
  };
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ฟังก์ชันดึงข้อมูลหนังสือแต่ละเล่มจาก API โดยใช้ book_id
  const fetchBookById = async (bookId: number): Promise<Book | null> => {
    try {
      const response = await fetch(`https://gutendex.com/books/${bookId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Book = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching book with id ${bookId}:`, err);
      return null;
    }
  };

  // ดึง bookmarkList จาก localStorage แล้ว loop ดึงข้อมูลหนังสือแต่ละเล่ม
  useEffect(() => {
    const fetchBooksFromBookmarks = async () => {
      setLoading(true);
      try {
        const storedBookmarks = localStorage.getItem("bookmarkList");
        if (!storedBookmarks) {
          setError("ไม่พบข้อมูล bookmark ใน localStorage");
          setLoading(false);
          return;
        }

        const bookmarkIds: number[] = JSON.parse(storedBookmarks);
        const booksFetched: Book[] = [];

        // loop ดึงข้อมูลหนังสือแต่ละเล่ม (อาจใช้ Promise.all หากต้องการดึงแบบขนาน)
        for (const id of bookmarkIds) {
          const bookData = await fetchBookById(id);
          if (bookData) {
            booksFetched.push(bookData);
          }
        }
        setBooks(booksFetched);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchBooksFromBookmarks();
  }, []);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  console.log("หนังสือ",books,"err", error);

  return (
    <Container>
      <Main>รายการหนังสือที่บันทึกไว้</Main>
      {books.length === 0 ? (
        <p>ไม่พบหนังสือ</p>
      ) : (
        <GridContainer>
          {books.map((book) => (
            <BookCard key={book.id}>
              <Title>{book.title}</Title>
              <Author>
                ผู้แต่ง: {book.authors.map((a) => a.name).join(", ")}
              </Author>
              {/* สามารถเพิ่มข้อมูลอื่นๆ ที่ต้องการแสดง */}
            </BookCard>
          ))}
        </GridContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const Main = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BookCard = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Author = styled.p`
  font-size: 16px;
  color: #555;
`;

export default BookList;
