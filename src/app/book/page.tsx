"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice";
import { searchBooks } from "../../store/searchSlice";
import { RootState, AppDispatch } from "../../store/store";
import BookCard from "../../components/bookCard";
import SearchInput from "../../components/searchInput";
import styled from "styled-components";

const AllBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchClicked, setIsSearchClicked] = useState<boolean>(false); // ใช้เพื่อดูว่า user กด search แล้วหรือยัง

  useEffect(() => {
    const bookmarks = localStorage.getItem("bookmarkList");
    if (bookmarks) {
      setBookmarkList(JSON.parse(bookmarks));
    }
  }, []);

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

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMoreBooks, next]);

  const handleSearch = () => {
    if (searchQuery !== "") {
      setIsSearchClicked(true);
      dispatch(searchBooks(searchQuery));
    }
  };

  const booksToShow =
    searchQuery && isSearchClicked ? searchResults : reduxBooks;

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
      ) : "กำลังโหลด..."}
    </Container>
  );
};

// 🎨 Styled Components
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
  font-size: 60px;
  text-align: center;
  font-weight: bold;
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
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
`;

export default AllBook;
