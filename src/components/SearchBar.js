import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchForm = styled.div`
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  outline: none;
`;

const SearchButton = styled.button`
  padding: 1rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchForm>
          <SearchInput
            type="text"
            placeholder="Search by location, property name, phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="submit">Search</SearchButton>
        </SearchForm>
      </form>
    </SearchContainer>
  );
}

export default SearchBar;