import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.div`
  margin-bottom: 2rem;
`;

const ResultsInfo = styled.div`
  margin-bottom: 1rem;
  font-weight: bold;
  color: #333;
`;

const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PropertyCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PropertyHeader = styled.div`
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const PropertyName = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: #2c3e50;
`;

const PropertyBody = styled.div`
  padding: 1rem;
`;

const PropertyInfo = styled.div`
  margin-bottom: 0.5rem;
  color: #555;
  display: flex;
  align-items: center;
`;

const PropertyLabel = styled.span`
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 80px;
`;

const PropertyValue = styled.span`
  color: #333;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const EmptyStateMessage = styled.p`
  color: #7f8c8d;
  margin-top: 1rem;
`;

function PropertyList({ properties, loading, onPropertyClick }) {
  if (loading) {
    return <div className="spinner"></div>;
  }

  if (properties.length === 0) {
    return (
      <EmptyState>
        <EmptyStateMessage>No properties found matching your criteria.</EmptyStateMessage>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      <ResultsInfo>{properties.length} properties found</ResultsInfo>
      <PropertyGrid>
        {properties.map((property) => (
          <PropertyCard key={property.id} onClick={() => onPropertyClick(property)}>
            <PropertyHeader>
              <PropertyName>
                {property.매물명 || `${property.지역 || ''} ${property.소재지 || ''}`}
              </PropertyName>
            </PropertyHeader>
            <PropertyBody>
              <PropertyInfo>
                <PropertyLabel>Region:</PropertyLabel>
                <PropertyValue>{property.지역 || '-'}</PropertyValue>
              </PropertyInfo>
              <PropertyInfo>
                <PropertyLabel>Type:</PropertyLabel>
                <PropertyValue>{property.매물종류 || '-'}</PropertyValue>
              </PropertyInfo>
              <PropertyInfo>
                <PropertyLabel>Transaction:</PropertyLabel>
                <PropertyValue>{property.거래유형 || '-'}</PropertyValue>
              </PropertyInfo>
              <PropertyInfo>
                <PropertyLabel>Price:</PropertyLabel>
                <PropertyValue>{property.금액 || '-'}</PropertyValue>
              </PropertyInfo>
            </PropertyBody>
          </PropertyCard>
        ))}
      </PropertyGrid>
    </ListContainer>
  );
}

export default PropertyList;