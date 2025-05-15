"use client";
import React from "react";
import styled from "styled-components";

const AllBook: React.FC = () => {


  return (
    <Container>
      <Main>Ebook Shop</Main>
      <CenterSearch>

      </CenterSearch>
      <GridContainer>
       
      </GridContainer>
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

const CenterSearch = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

export default AllBook;
