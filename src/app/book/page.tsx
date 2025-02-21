"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice";
import { RootState, AppDispatch } from "../../store/store";
import BookCard from "../../components/bookCard";
import SearchInput from "../../components/searchInput";
import styled from "styled-components";
import axios from "axios";

const AllBook: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    books: reduxBooks,
    loading,
    next,
  } = useSelector((state: RootState) => state.books);
  const [firstLoad, setFirstLoad] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [bookmarkList, setBookmarkList] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // สถานะคำค้นหา
  const [books, setBooks] = useState<[]>([]); // สถานะเก็บข้อมูลหนังสือจาก API
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false); // สถานะโหลดการค้นหาหนังสือ

  useEffect(() => {
    const bookmarks = localStorage.getItem("bookmarkList");
    if (bookmarks) {
      setBookmarkList(JSON.parse(bookmarks));
    }
  }, []);
  useEffect(() => {
    if (!firstLoad && !loading) {
      dispatch(fetchBooks(null)); 
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

  // ฟังก์ชันค้นหาหนังสือจาก API
  const searchBooks = async (query: string) => {
    if (!query) {
      setBooks([]); // เคลียร์ข้อมูลในกรณีที่ไม่มีคำค้นหา
      return;
    }
    setLoadingSearch(true);
    try {
      const response = await axios.get(
        `https://gutendex.com/books?search=${query.replace(" ", "%20")}`
      );

      if (response.data && response.data.results) {
        setBooks(response.data.results); // เก็บผลลัพธ์ที่ได้จาก API
      } else {
        setBooks([]); // ถ้าไม่มีข้อมูล ก็เคลียร์
      }
    } catch (err) {
      console.error(err); // กรณีเกิดข้อผิดพลาด
      setBooks([]); // ในกรณีที่เกิดข้อผิดพลาด ก็เคลียร์ข้อมูล
    } finally {
      setLoadingSearch(false);
    }
  };

  console.log("books", books);

  return (
    <Container>
      <Main>Explore All Books Here</Main>
      <CenterSearch>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchBooks={searchBooks}
        />
      </CenterSearch>
      {searchQuery === "" && reduxBooks.length === 0 && !loading && !loadingSearch ? (
        <></> 
      ) : (
        <GridContainer>
          {(searchQuery ? books : reduxBooks).map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`}
              data={book}
              bookmarkList={bookmarkList}
              setBookmarkList={setBookmarkList}
            />
          ))}
        </GridContainer>
      )}
      {(loading || loadingSearch) && <LoadMoreRef>กำลังโหลด...1</LoadMoreRef>}
      {next && !loading && !loadingSearch && reduxBooks.length > 0 && (
        <LoadMoreRef ref={loadMoreRef}>กำลังโหลด...2</LoadMoreRef>
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
