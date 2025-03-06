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

  const getBookmarkIds = (): number[] => {
    if (!user) return [];

    const storedBookmarks = localStorage.getItem("bookmarks");
    if (!storedBookmarks) return [];

    try {
      const bookmarks = JSON.parse(storedBookmarks);
      const userBookmark = bookmarks.find((b: { id: string }) => b.id === user.sub);
      return userBookmark ? userBookmark.book_id : [];
    } catch (err) {
      console.error("Error parsing bookmarks:", err);
      return [];
    }
  };

  const fetchBookById = async (bookId: number): Promise<Book | null> => {
    try {
      const response = await fetch(`https://gutendex.com/books?ids=${bookId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.results.length > 0 ? data.results[0] : null;
    } catch (err) {
      console.error(`Error fetching book with id ${bookId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchBooksFromBookmarks = async () => {
      setLoading(true);
      try {
        const bookmarkIds = getBookmarkIds();
        setBookmarkList(bookmarkIds);

        const booksFetched: Book[] = await Promise.all(
          bookmarkIds.map(async (id) => {
            const bookData = await fetchBookById(id);
            return bookData!;
          })
        );

        setBooks(booksFetched.filter((b) => b !== null));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchBooksFromBookmarks();
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBookmarkClick = (_bookId: number) => {
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
              onBookmarkClick={() => handleBookmarkClick(book.id)}
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
