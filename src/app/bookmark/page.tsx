"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@auth0/nextjs-auth0/client";
import BookCard from "@/components/client/bookCard";

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
  const { user } = useUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkList, setBookmarkList] = useState<number[]>([]);

  // ฟังก์ชันดึง bookmark ids จาก API
  const fetchBookmarksFromAPI = async (userSub: string): Promise<number[]> => {
    console.log("กำลังดึง bookmarks ของ user:", userSub);
    try {
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userSub }),
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูล bookmarks จาก API ได้");
      }

      const data = await response.json();
      console.log("ผลลัพธ์ที่ได้จาก /api/bookmark:", data);

      const book_ids: number[] = Array.isArray(data.book_ids) ? data.book_ids : [];

      console.log("book_ids ที่ได้:", book_ids);
      console.log("data.bookmarks:", data.bookmarks);
      return book_ids;
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล bookmarks:", error);
      return [];
    }
  };

  // ฟังก์ชันดึงข้อมูลหนังสือจาก Gutendex
  const fetchBookById = async (bookId: number): Promise<Book | null> => {
    console.log(`กำลังดึงข้อมูลหนังสือ ID: ${bookId}`);
    try {
      const response = await fetch(`https://gutendex.com/books?ids=${bookId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`ผลลัพธ์จาก Gutendex API สำหรับ bookId ${bookId}:`, data);

      if (data.results.length > 0) {
        return data.results[0];
      } else {
        console.log(`ไม่พบข้อมูลหนังสือสำหรับ ID: ${bookId}`);
        return null;
      }
    } catch (err) {
      console.error(`Error fetching book with id ${bookId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    if (!user?.sub) {
      console.log("ยังไม่มี user หรือ user.sub");
      return;
    }
  
    const fetchBooksFromBookmarks = async () => {
      console.log("เริ่มดึงข้อมูล bookmarks + books");
      setLoading(true);
      try {
        const bookmarkIds = await fetchBookmarksFromAPI(user.sub!);
        console.log("user.sub:", user.sub);
        console.log("Bookmark IDs ที่ได้:", bookmarkIds);
  
        if (bookmarkIds.length === 0) {
          setError("ไม่มีข้อมูล bookmarks");
          return;
        }
  
        setBookmarkList(bookmarkIds);
  
        const booksFetched = await Promise.all(
          bookmarkIds.map(async (id) => {
            const bookData = await fetchBookById(id);
            console.log(`ข้อมูลหนังสือที่ดึงได้ของ ${id}:`, bookData);
            return bookData;
          })
        );
  
        const nonNullBooks = booksFetched.filter((b): b is Book => b !== null);
        setBooks(nonNullBooks);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooksFromBookmarks();
  }, [user]);
  

  const handleBookmarkClick = () => {
    if (!user) {
      if (window.confirm("กรุณาเข้าสู่ระบบเพื่อบันทึก Bookmark")) {
        window.location.href = "/api/auth/login";
      }
      return;
    }
  };
  
  

  if (!user) {
    return <p>กรุณาเข้าสู่ระบบเพื่อดู Bookmark</p>;
  }

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Container>
      <Main>My Bookmark</Main>
      {books.length === 0 ? (
        <p>ไม่พบหนังสือ</p>
      ) : (
        <GridContainer>
          {books.map((book) => (
            <BookCard
              key={book.id}
              data={book}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
              onBookmarkClick={() => handleBookmarkClick}
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

const Main = styled.h1`
  padding: 10px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
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

export default BookList;
