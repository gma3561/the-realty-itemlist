import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #fff;
  padding: 1.5rem 0;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>Property Search System</Title>
      <Subtitle>Find and manage real estate properties easily</Subtitle>
    </HeaderContainer>
  );
}

export default Header;