import React from "react";
import styled from "styled-components";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchBooks: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchQuery, setSearchQuery, searchBooks }) => {
  return (
    <SearchContainer>
      <SearchField
        type="text"
        placeholder="Search a Book"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchButton onClick={() => searchBooks(searchQuery)}>
        Search
      </SearchButton>
    </SearchContainer>
  );
};

// Styled Components
const SearchContainer = styled.div`

  padding: 10px;
  border: 2px solid var(--ELEMENT_YELLOW);
  border-radius: 5px;
  width: 450px;
`;

const SearchField = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: var(--ELEMENT_BROWN);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 200px;
`;

export default SearchInput;
