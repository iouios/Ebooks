"use client";
import React from "react";
import styled from "styled-components";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchBooks: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  searchBooks,
}) => {
  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      searchBooks(searchQuery); // ค้นหาหลังจากกดปุ่ม Search
    }
  };

  return (
    <SearchContainer>
      <SearchField
        type="text"
        placeholder="Search a Book"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchButton onClick={handleSearchClick}>Search</SearchButton>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  padding: 8px;
  border: 2px solid var(--ELEMENT_YELLOW);
  border-radius: 5px;
  width: 450px;
  @media (max-width: 500px) {
    display: flex;
    width: 290px;
    padding: 4px;
  }
`;

const SearchField = styled.input`
  padding: 8px 14px;
  font-size: 16px;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: transparent;

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (max-width: 500px) {
    width: 100%; 
    max-width: 250px;
    padding: 8px 10px;
  }  
`;

const SearchButton = styled.button`
  font-size: 16px;
  background-color: var(--ELEMENT_BROWN);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0.5, 0.5, 0.5);
  width: 200px;
  @media (min-width: 500px) {
    padding: 8px 16px;
  }
  @media (max-width: 500px) {
    padding: 0px 16px;
    padding: 10px;
  }
`;

export default SearchInput;
