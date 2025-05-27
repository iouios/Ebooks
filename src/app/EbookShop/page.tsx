"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>("/api/ebookshop?page=1");
  const [bookmarkList, setBookmarkList] = useState<(number | string)[]>([]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Get ?search from URL
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
      setInputValue(query);
      setIsSearchClicked(true);
    }
  }, [searchParams]);

  // Fetch book data
  const fetchBooks = useCallback(async (pageUrl: string | null) => {
    if (!pageUrl) return;
    setLoading(true);
    try {
      const res = await fetch(pageUrl);
      if (!res.ok) throw new Error("Fetch failed");
      const data: ApiResponse = await res.json();
      const newBooks = data.results.map(convertBook);

      setBooks((prev) => {
        const ids = new Set(prev.map((b) => b.id));
        return [...prev, ...newBooks.filter((b) => !ids.has(b.id))];
      });

      setNextPage(data.next);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks("/api/ebookshop?page=1");
  }, [fetchBooks]);

  // Infinite scroll observer
  useEffect(() => {
    if (!nextPage || !loadMoreRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchBooks(nextPage);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [fetchBooks, nextPage, loading]);

  // Fetch bookmarks
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

  const handleSearch = () => {
    setIsSearchClicked(true);
    setSearchQuery(inputValue.trim());
  };

  const filteredBooks =
    isSearchClicked && searchQuery.trim() !== ""
      ? books.filter(
          (b) =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.id.toString().includes(searchQuery.toLowerCase())
        )
      : books;

  return (
    <Container>
      <Main>Ebook Books</Main>
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

      {loading && <LoadMoreRef>กำลังโหลดข้อมูล...</LoadMoreRef>}

      {nextPage && !loading && (
        <LoadMoreRef ref={loadMoreRef}>
          เลื่อนลงเพื่อโหลดเพิ่มเติม...
        </LoadMoreRef>
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
  color: gray;
`;

export default EbookShop;
