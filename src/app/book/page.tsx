"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice";
import { searchBooks } from "../../store/searchSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import BookCard from "@/components/client/bookCard";
import SearchInput from "@/components/client/searchInput";
import styled from "styled-components";

const AllBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const {
    books: reduxBooks,
    loading,
    next,
  } = useSelector((state: RootState) => state.books);
  const { searchResults, searchLoading } = useSelector(
    (state: RootState) => state.search
  );

  const [firstLoad, setFirstLoad] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [bookmarkList, setBookmarkList] = useState<number[]>([]);
  const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // โหลด bookmarks เมื่อ user login
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userSub: user.sub }),
        });

        if (!response.ok) throw new Error("โหลด bookmarks ล้มเหลว");

        const data = await response.json();
        const book_ids = data.book_ids || [];
        setBookmarkList(book_ids);
      } catch (error) {
        console.error("ดึง bookmark ไม่สำเร็จ:", error);
      }
    };

    fetchBookmarks();
  }, [user]);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!firstLoad && !loading && !searchLoading) {
      dispatch(fetchBooks(null));
      setFirstLoad(true);
    }
  }, [dispatch, firstLoad, loading, searchLoading]);

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

    return () => observerRef.current?.disconnect();
  }, [loadMoreBooks, next]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearchClicked(true);
      dispatch(searchBooks(searchQuery));
    }
  }, [dispatch, searchQuery]);

  const booksToShow =
    searchQuery && isSearchClicked ? searchResults : reduxBooks;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchBooks(searchQuery));
    }
  };

  return (
    <Container>
      <Main>Explore All Books Here</Main>
      <CenterSearch>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchBooks={handleSearch}
        />
      </CenterSearch>
      <GridContainer>
        {booksToShow.length > 0 &&
          booksToShow.map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`}
              data={book}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
            />
          ))}
      </GridContainer>
      {!isSearchClicked && (loading || searchLoading) && (
        <LoadMoreRef>กำลังค้นหา...</LoadMoreRef>
      )}
      {next &&
      !loading &&
      !searchLoading &&
      !isSearchClicked &&
      reduxBooks.length > 0 ? (
        <LoadMoreRef ref={loadMoreRef}>กำลังค้นหา...</LoadMoreRef>
      ) : null}
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

const LoadMoreRef = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: gray;
`;

const CenterSearch = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

export default AllBook;
