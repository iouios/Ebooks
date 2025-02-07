"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice"; 
import { RootState, AppDispatch } from "../../store/store";
import InfiniteScroll from "react-infinite-scroll-component"; 
import BookCard from "../../components/bookCard"; 
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
`;

const BookList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { books, loading, next } = useSelector(
    (state: RootState) => state.books
  );

  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (hasMore) {
      dispatch(fetchBooks(next));
    }
  }, [dispatch, hasMore, next]);

  const fetchData = () => {
    if (!next) {
      setHasMore(false);
    }
  };

  return (
    <Container>
      <h2>Explore All Books Here</h2>
      {books.length === 0 && !loading ? (
        <p>ไม่มีข้อมูลหนังสือ</p>
      ) : (
        <InfiniteScroll
          dataLength={books.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<div>กำลังโหลด...</div>}
          endMessage={<div>ไม่พบข้อมูลเพิ่มเติม</div>}
        >
          <GridContainer>
            {books.map((book) => (
              <div key={`${book.id}-${book.title}`}>
                
                <BookCard data={book} />
              </div>
            ))}
          </GridContainer>
        </InfiniteScroll>
      )}
    </Container>
  );
};

export default BookList;
