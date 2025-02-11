"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice";
import { RootState, AppDispatch } from "../../store/store";
import BookCard from "../../components/bookCard";
import styled from "styled-components";

const BookList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading, next } = useSelector((state: RootState) => state.books);
  const [firstLoad, setFirstLoad] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [bookmarkList, setBookmarkList] = useState<number[]>([]);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(storedBookmarks);

        // ตรวจสอบว่าเป็นอาร์เรย์หรือไม่
        if (Array.isArray(parsedBookmarks)) {
          const bookmarks = parsedBookmarks.flatMap((bookmark: { book_id: number }) => bookmark.book_id);
          setBookmarkList(bookmarks);
        } else {
          console.warn("Bookmarks data is not an array, resetting to []:", parsedBookmarks);
          setBookmarkList([]); // ถ้าไม่ใช่อาร์เรย์ รีเซ็ตเป็น []
        }
      } catch (error) {
        console.error("Error parsing bookmarks:", error);
        setBookmarkList([]); // ถ้ามี error รีเซ็ตเป็น []
      }
    }
  }, []);

  useEffect(() => {
    if (!firstLoad && !loading) {
      dispatch(fetchBooks(null));
      setFirstLoad(true);
    }
  }, [dispatch, firstLoad, loading]);

  useEffect(() => {
    if (!next || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchBooks(next));
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [dispatch, next]);

  console.log("Redux Books State:", books);
console.log("Loading State:", loading);
console.log("Next Page:", next);


  return (
    <Container>
      <Main>Explore All Books Here</Main>
      {books.length === 0 && !loading ? (
        <p>ไม่มีข้อมูลหนังสือ</p>
      ) : (
        <GridContainer>
          {books.map((book, index) => (
            <div key={`${book.id}-${index}`}>
              <BookCard data={book} bookmarkList={bookmarkList} />
            </div>
          ))}
        </GridContainer>
      )}
      {loading && <LoadMoreRef>กำลังโหลด...</LoadMoreRef>}
      {next && !loading && <LoadMoreRef ref={loadMoreRef}>กำลังโหลด...</LoadMoreRef>}
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
  padding: 20px;
  color: var(--FONT_YELLOW);
  font-size: 40px;
  text-align: center;
  font-weight: bold;
`;

const LoadMoreRef = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: gray;
`;

export default BookList;
