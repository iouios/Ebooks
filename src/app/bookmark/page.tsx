"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import Link from "next/link";
import BookCard from "../../components/bookCard";  // Import BookCard component

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
  coverImage?: string;
  formats: {
    "text/plain"?: string;
    "application/epub+zip"?: string;
    "image/jpeg"?: string;
  };
}

const Bookmark: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarkList");
    if (storedBookmarks) {
      const bookmarkIds: number[] = JSON.parse(storedBookmarks); // ดึง book_id จาก localStorage
      fetchBooks(bookmarkIds);  // เรียกฟังก์ชัน fetchBooks
    } else {
      setLoading(false); // ไม่มีข้อมูลใน localStorage
    }
  }, []);

  const fetchBooks = async (bookmarkIds: number[]) => {
    try {
      const bookPromises = bookmarkIds.map((bookId) =>
        fetch(`https://gutendex.com/books/${bookId}`).then((res) => res.json())
      );
      const booksData = await Promise.all(bookPromises); // รอให้ข้อมูลทั้งหมดถูกดึงเสร็จ
      setBooks(booksData);  // เก็บข้อมูลหนังสือใน state
      setLoading(false);  // เปลี่ยนสถานะการโหลด
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      setLoading(false);  // หยุดการโหลด
    }
  };

  return (
    <Container>
      <Main>Your Bookmarked Books</Main>
      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p>{error}</p>}
      {books.length === 0 && !loading && !error && <p>ไม่มีข้อมูลหนังสือในรายการ</p>}
      {books.length > 0 && (
        <GridContainer>
          {books.map((book) => (
            <BookCard
              key={book.id}  // ใช้ book.id เป็น key สำหรับแต่ละหนังสือ
              data={book}  // ส่งข้อมูลหนังสือไปให้ BookCard
              bookmarkList={[]}
              setBookmarkList={() => {}}
            />
          ))}
        </GridContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Main = styled.div`
  padding: 20px;ง
  font-size: 40px;
  text-align: center;
  font-weight: bold;
`;

export default Bookmark;
