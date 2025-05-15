"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

type Ebook = {
  id: string;
  title: string;
  summaries: string;
  authors: string;
  languages: string[];
  bookshelves: string[];
  ebook_url: string;
  image_url: string;
};

type ApiResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ebook[];
};

const AllBook: React.FC = () => {
  const [books, setBooks] = useState<Ebook[]>([]);
  const [page, setPage] = useState<number>(1);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbooks = async () => {
      const res = await fetch(`/api/ebookshop?page=${page}`);
      const data: ApiResponse = await res.json();
      setBooks(data.results);
      setNext(data.next);
      setPrevious(data.previous);
    };

    fetchEbooks();
  }, [page]);

  return (
    <Container>


      <GridContainer>
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </GridContainer>

      <Pagination>
        <button onClick={() => setPage((p) => p - 1)} disabled={!previous}>
          ⬅️ ก่อนหน้า
        </button>
        <span>หน้า {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={!next}>
          ถัดไป ➡️
        </button>
      </Pagination>
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 20px;

  button {
    padding: 10px 20px;
    background-color: #ffcc00;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 10px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export default AllBook;
