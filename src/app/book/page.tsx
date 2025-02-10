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
      { threshold: 1.0 }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null; // Cleaning up the observer reference
      }
    };
  }, [dispatch, next]);

  return (
    <Container>
      <Main>Explore All Books Here</Main>
      {books.length === 0 && !loading ? (
        <p>ไม่มีข้อมูลหนังสือ</p>
      ) : (
        <GridContainer>
          {books.map((book, index) => (
            <div key={`${book.id}-${index}`}>
              <BookCard data={book} />
            </div>
          ))}
        </GridContainer>
      )}

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
