"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BookCard from "../../components/bookCard"; 

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
  const [bookmarkList, setBookmarkList] = useState<number[]>([]); 

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

  useEffect(() => {
    const fetchBooksFromBookmarks = async () => {
      setLoading(true);
      try {
        const storedBookmarks = localStorage.getItem("bookmarks");
        console.log("Stored Bookmarks:", storedBookmarks);

        if (!storedBookmarks) {
          setError("ไม่พบข้อมูล bookmark ใน localStorage");
          setLoading(false);
          return;
        }

        let bookmarkIds: number[];
        try {
          bookmarkIds = JSON.parse(storedBookmarks);
          if (!Array.isArray(bookmarkIds)) {
            throw new Error("bookmarkList ไม่ใช่ array");
          }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          setError("ข้อมูล bookmark ผิดพลาด");
          setLoading(false);
          return;
        }
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
  }, []);

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
            />
          ))}
        </GridContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;  
  min-height: 100vh; 
  padding: 20px;
`;

const Main = styled.h1`
  text-align: center;
  margin-top: 60px;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
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
