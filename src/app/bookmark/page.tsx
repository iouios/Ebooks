"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "@auth0/nextjs-auth0/client";
import BookCard from "@/components/client/bookCard";

// Interfaces
interface Author {
  name: string;
}

interface Book {
  id: number | string;
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

interface RawBook {
  id: number;
  title: string;
  authors?: Author[];
  languages?: string[];
  subjects?: string[];
  download_count: number;
  summaries?: string[];
  bookshelves?: string[];
  formats?: RawFormat;
  image_url?: string;
}

interface RawFormat {
  [key: string]: string | undefined;
  "text/plain"?: string;
  "application/epub+zip"?: string;
  "image/jpeg"?: string;
}

interface ApiResponse {
  next: string | null;
  results: RawBook[];
}

// Convert raw book to normalized Book
const convertBook = (raw: RawBook): Book => {
  return {
    id: raw.id,
    title: raw.title,
    authors: Array.isArray(raw.authors) ? raw.authors : [],
    languages: Array.isArray(raw.languages) ? raw.languages : [],
    subjects: Array.isArray(raw.subjects) ? raw.subjects : [],
    download_count: raw.download_count,
    summaries: Array.isArray(raw.summaries) ? raw.summaries : [],
    bookshelves: Array.isArray(raw.bookshelves) ? raw.bookshelves : [],
    formats: {
      "text/plain": raw.formats?.["text/plain"],
      "application/epub+zip": raw.formats?.["application/epub+zip"],
      "image/jpeg": raw.formats?.["image/jpeg"] ?? raw.image_url,
    },
  };
};

// Main Component
const BookList: React.FC = () => {
  const { user } = useUser();
  const [bookmarkBooks, setBookmarkBooks] = useState<Book[]>([]);
  const [ebookshopBooks, setEbookshopBooks] = useState<Book[]>([]);
  const [bookmarkList, setBookmarkList] = useState<(number | string)[]>([]);
  const [activeTab, setActiveTab] = useState<"bookmarks" | "shop">("bookmarks");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarksFromAPI = async (
    userSub: string
  ): Promise<(number | string)[]> => {
    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSub }),
      });
      if (!res.ok) throw new Error("ดึง bookmarks ไม่ได้");
      const data = await res.json();
      return Array.isArray(data.book_ids) ? data.book_ids : [];
    } catch (err) {
      console.error("Error loading bookmarks:", err);
      return [];
    }
  };

  const fetchBooksByIds = async (ids: (number | string)[]) => {
    const cleanIds = ids.map(Number).filter((id) => !isNaN(id));
    if (cleanIds.length === 0) return [];
    const res = await fetch(
      `https://gutendex.com/books?ids=${cleanIds.join(",")}`
    );
    const data = await res.json();
    return Array.isArray(data.results) ? data.results : [];
  };

  const fetchAllEbooksFromShop = async (): Promise<Book[]> => {
    let nextPage: string | null = `/api/ebookshop?page=1`;
    const allBooks: Book[] = [];
    while (nextPage) {
      const res = await fetch(nextPage);
      const data: ApiResponse = await res.json();
      const convertedBooks = data.results.map(convertBook);
      allBooks.push(...convertedBooks);
      nextPage = data.next;
    }
    return allBooks;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.sub) return;

      setLoading(true);
      try {
        const [bookmarkIds, ebookshopRawBooks] = await Promise.all([
          fetchBookmarksFromAPI(user.sub),
          fetchAllEbooksFromShop(),
        ]);

        setBookmarkList(bookmarkIds);

        const bookmarkRawBooks = await fetchBooksByIds(bookmarkIds);
        const convertedBookmarkBooks = bookmarkRawBooks.map(convertBook);
        const convertedEbookshopBooks = ebookshopRawBooks;

        setBookmarkBooks(convertedBookmarkBooks);
        setEbookshopBooks(convertedEbookshopBooks);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลทั้งหมด:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.sub]);

  const handleBookmarkClick = () => {
    if (!user && window.confirm("กรุณาเข้าสู่ระบบเพื่อบันทึก Bookmark")) {
      window.location.href = "/api/auth/login";
    }
  };

  if (!user) return <p>กรุณาเข้าสู่ระบบเพื่อดู Bookmark</p>;
  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("bookmarkList:", bookmarkList);

  return (
    <Container>
      {/* แท็บปุ่มสลับ */}
      <TabContainer>
        <TabButton
          active={activeTab === "bookmarks"}
          onClick={() => setActiveTab("bookmarks")}
        >
          My Bookmarks
        </TabButton>
        <TabButton
          active={activeTab === "shop"}
          onClick={() => setActiveTab("shop")}
        >
          My BookmarksShop
        </TabButton>
      </TabContainer>

      {/* แสดงข้อมูลตามแท็บที่เลือก */}
      {activeTab === "bookmarks" && (
        <>
          {bookmarkBooks.length === 0 ? (
            <p>ไม่มีหนังสือที่ Bookmark ไว้</p>
          ) : (
            <GridContainer>
              {bookmarkBooks.map((book) => (
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
        </>
      )}

      {activeTab === "shop" && (
        <>
          {ebookshopBooks.filter((book) => bookmarkList.includes(book.id))
            .length === 0 ? (
            <p>ไม่มีหนังสือที่ Bookmark ไว้ในร้าน</p>
          ) : (
            <GridContainer>
              {ebookshopBooks
                .filter((book) => bookmarkList.includes(book.id))
                .map((book) => (
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
        </>
      )}
    </Container>

  );
};

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;
`;

const TabButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active"
})<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "var(--FONT_YELLOW)" : "#eee")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: none;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 8px;
`;

const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
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
