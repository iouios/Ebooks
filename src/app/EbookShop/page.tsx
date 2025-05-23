"use client";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import BookCard from "@/components/client/bookCard";
import SearchInput from "@/components/client/searchInput";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useSearchParams } from "next/navigation";

interface Author {
  name: string;
}

interface ApiBook {
  id: number | string;
  title: string;
  summaries: string[];
  authors: Author[] | string;
  languages?: string[];
  bookshelves?: string[];
  ebook_url: string;
  image_url: string;
  subjects?: string[];
  formats?: Record<string, string>;
  download_count?: number;
}

interface Book {
  id: number | string;
  title: string;
  summaries: string[];
  authors: Author[];
  languages: string[];
  bookshelves: string[];
  ebook_url: string;
  image_url: string;
  subjects: string[];
  formats: {
    "text/plain"?: string;
    "application/epub+zip"?: string;
    "image/jpeg"?: string;
  };
  download_count: number;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiBook[];
}

const convertBook = (book: ApiBook): Book => ({
  id: String(book.id),
  title: book.title,
  summaries: book.summaries ?? [],
  authors:
    typeof book.authors === "string"
      ? [{ name: book.authors }]
      : book.authors ?? [],
  languages: book.languages ?? [],
  bookshelves: book.bookshelves ?? [],
  ebook_url: book.ebook_url,
  image_url: book.image_url,
  subjects: book.subjects ?? [],
  formats: {
    "text/plain": book.formats?.["text/plain"],
    "application/epub+zip": book.formats?.["application/epub+zip"],
    "image/jpeg": book.formats?.["image/jpeg"] ?? book.image_url,
  },
  download_count: book.download_count ?? 0,
});

const EbookShop: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<string | null>(null);
  const [bookmarkList, setBookmarkList] = useState<(number | string)[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      setInputValue(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userSub: user.sub }),
        });
        if (!response.ok) throw new Error("โหลด bookmarks ล้มเหลว");
        const data = await response.json();
        setBookmarkList(data.book_ids || []);
      } catch (error) {
        console.error("ดึง bookmark ไม่สำเร็จ:", error);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await fetch(`/api/ebookshop?page=${page}`);
        if (!res.ok) throw new Error(`Fetch failed (page ${page})`);

        const data: ApiResponse = await res.json();
        const convertedBooks = data.results.map(convertBook);
        
        setBooks((prev) => {
          const existingIds = new Set(prev.map((book) => book.id));
          const newBooks = convertedBooks.filter(
            (book) => !existingIds.has(book.id)
          );
          return [...prev, ...newBooks];
        });

        setNext(data.next);
      } catch (err) {
        console.error("Error fetching ebooks:", err);
      }
    };

    fetchEbooks();
  }, [page]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.id.toString().toLowerCase().includes(query)
      );
      setFilteredBooks(filtered.length > 0 ? filtered : books);
    }
  }, [searchQuery, books]);

  useEffect(() => {
    if (!loadMoreRef.current || !next) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && next) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [next]);

  const handleSearch = () => {
    setSearchQuery(inputValue.trim());
  };

  console.log("searchQuery:", searchQuery);

  return (
    <Container>
      <Main>Explore All Books</Main>
      <CenterSearch>
        <SearchInput
          searchQuery={inputValue}
          setSearchQuery={setInputValue}
          searchBooks={handleSearch}
        />
      </CenterSearch>

      <GridContainer>
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            data={book}
            bookmarkList={bookmarkList}
            setBookmarkList={setBookmarkList}
          />
        ))}
      </GridContainer>

      {next && <LoadMoreRef ref={loadMoreRef}>กำลังโหลด...</LoadMoreRef>}
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
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Main = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 60px;
  color: var(--FONT_YELLOW);
  font-weight: bold;
  @media (max-width: 500px) {
    font-size: 30px;
  }
`;

const CenterSearch = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const LoadMoreRef = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
`;

export default EbookShop;
