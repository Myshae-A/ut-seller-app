import React from 'react';
import { InputGroup, InputLeftElement, Input, Tooltip } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';


// unsure on implementation of this, but created this file forz


const SearchBar = ({ searchQuery, onSearchInput, onSearchKeyDown }) => {
  return (
    <Tooltip label="Press 'Enter' to search" aria-label="Search tooltip">
    <InputGroup maxW="300px">
      <InputLeftElement pointerEvents="none">
        <FiSearch color="gray.600" />
      </InputLeftElement>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={onSearchInput}
        onKeyDown={onSearchKeyDown}
        borderRadius="30"
        borderColor="#DD933340"
        focusBorderColor="#DD8533"
        bgColor="#DD933340"
      />
    </InputGroup>
    </Tooltip>
  );
};

export default SearchBar;