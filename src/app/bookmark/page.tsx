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

  // ดึงเฉพาะ book_ids ที่ bookmark ไว้จาก API
  const fetchBookmarksFromAPI = async (userSub: string): Promise<number[]> => {
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
      return Array.isArray(data.book_ids) ? data.book_ids : [];
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล bookmarks:", error);
      return [];
    }
  };

  // ดึงข้อมูลหนังสือตาม ID จาก Gutendex
  const fetchBooks = async (ids: number[]) => {
    try {
      const responses = await Promise.all(
        ids.map((id) =>
          fetch(`https://gutendex.com/books?ids=${id}`).then((res) => res.json())
        )
      );

      const booksData = responses
        .map((res) => res.results?.[0])
        .filter((book): book is Book => book !== undefined);

      setBooks(booksData);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ:", err);
      setError("ไม่สามารถโหลดข้อมูลหนังสือได้");
    }
  };

  useEffect(() => {
    const loadBookmarksAndBooks = async () => {
      if (!user?.sub) return;

      setLoading(true);
      try {
        const ids = await fetchBookmarksFromAPI(user.sub);
        if (ids.length === 0) {
          setError("ไม่มีข้อมูล bookmarks");
          return;
        }

        setBookmarkList(ids);
        await fetchBooks(ids);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarksAndBooks();
  }, [user?.sub]);

  const handleBookmarkClick = () => {
    if (!user && window.confirm("กรุณาเข้าสู่ระบบเพื่อบันทึก Bookmark")) {
      window.location.href = "/api/auth/login";
    }
  };

  if (!user) return <p>กรุณาเข้าสู่ระบบเพื่อดู Bookmark</p>;
  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>Error: {error}</p>;

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
              onBookmarkClick={handleBookmarkClick}
            />
          ))}
        </GridContainer>
      )}
    </Container>
  );
};

// Styled-components
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
