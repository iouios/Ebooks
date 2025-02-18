"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice";
import { RootState, AppDispatch } from "../../store/store";
import BookCard from "../../components/bookCard";
import styled from "styled-components";

const AllBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading, next } = useSelector(
    (state: RootState) => state.books
  );
  const [firstLoad, setFirstLoad] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [bookmarkList, setBookmarkList] = useState<number[]>([]);

  useEffect(() => {
    const bookmarks = localStorage.getItem("bookmarkList");
    if (bookmarks) {
      setBookmarkList(JSON.parse(bookmarks));
    }
  }, []);

  useEffect(() => {
    if (!firstLoad && !loading) {
      dispatch(fetchBooks(null));  // ตรวจสอบว่า `fetchBooks(null)` จำเป็นไหมในกรณีเริ่มต้น
      setFirstLoad(true);
    }
  }, [dispatch, firstLoad, loading]);

  const loadMoreBooks = useCallback(() => {
    if (next) {
      dispatch(fetchBooks(next));
    }
  }, [dispatch, next]);

  useEffect(() => {
    if (!next || !loadMoreRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreBooks();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMoreBooks, next]);

  console.log("Bookmark List:", bookmarkList);

  return (
    <Container>
      <Main>Explore All Books Here</Main>
      {books.length === 0 && !loading ? (
        <p>ไม่มีข้อมูลหนังสือ</p>
      ) : (
        <GridContainer>
          {books.map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`} 
              data={book}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
            />
          ))}
        </GridContainer>
      )}
      {loading && <LoadMoreRef>กำลังโหลด...</LoadMoreRef>}
      {next && !loading && (
        <LoadMoreRef ref={loadMoreRef}>กำลังโหลด...</LoadMoreRef>
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


export default AllBook;
