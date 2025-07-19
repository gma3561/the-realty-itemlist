import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
`;

function FilterBar({ filters, options, onFilterChange }) {
  return (
    <FilterContainer>
      <FilterGroup>
        <FilterLabel htmlFor="regionFilter">Region</FilterLabel>
        <FilterSelect
          id="regionFilter"
          value={filters.region}
          onChange={(e) => onFilterChange('region', e.target.value)}
        >
          <option value="">All Regions</option>
          {options.regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </FilterSelect>
      </FilterGroup>
      
      <FilterGroup>
        <FilterLabel htmlFor="propertyTypeFilter">Property Type</FilterLabel>
        <FilterSelect
          id="propertyTypeFilter"
          value={filters.propertyType}
          onChange={(e) => onFilterChange('propertyType', e.target.value)}
        >
          <option value="">All Types</option>
          {options.propertyTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </FilterSelect>
      </FilterGroup>
      
      <FilterGroup>
        <FilterLabel htmlFor="transactionTypeFilter">Transaction Type</FilterLabel>
        <FilterSelect
          id="transactionTypeFilter"
          value={filters.transactionType}
          onChange={(e) => onFilterChange('transactionType', e.target.value)}
        >
          <option value="">All Transactions</option>
          {options.transactionTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </FilterSelect>
      </FilterGroup>
    </FilterContainer>
  );
}

export default FilterBar;