"use client";
import styled from 'styled-components';
import { useState } from 'react';

// Define the type for the Menu component props
interface MenuProps {
  isMenuOpen: boolean;
}

// สร้างคอมโพเนนต์ Button โดยใช้ styled-components
const Button = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #282c34;
  color: white;
  padding: 12px 20px;

  /* Center the menu items horizontally when the screen is wide */
  @media (min-width: 500px) {
    justify-content: center;
    gap: 30px;
  }
`;

const Menu = styled.div<MenuProps>`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 20px;

  @media (max-width: 500px) {
    display: ${(props) => (props.isMenuOpen ? 'flex' : 'none')};
    position: absolute;
    top: 50px; /* Position directly below the hamburger */
    right: 0;
    width: 200px; /* Adjust the width as you need */
    height: 100%; /* Cover full screen height */
    background-color: #282c34;
    padding: 20px;
    z-index: 1000;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    text
  }
`;

const Hamburger = styled.div<{ isOpen: boolean }>`
  display: none;
  flex-direction: column; /* Make it vertical */
  gap: 4px;
  cursor: pointer;
  width: 30px;
  height: 20px;
  justify-content: space-between;

  div {
    width: 100%;
    height: 3px;
    background-color: white;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    display: flex;
  }

  /* Hamburger open state transformations */
  ${(props) =>
    props.isOpen &&
    `
    div:nth-child(1) {
      transform: rotate(60deg);
      position: relative;
      top: 5px;
    }
    div:nth-child(2) {
      opacity: 0;
    }
    div:nth-child(3) {
      transform: rotate(-60deg);
      position: relative;
      top: -10px;
    }
  `}
`;

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div>
      <Nav>
        <div>Gutendex BOOKPOINT</div>

        <Menu isMenuOpen={isMenuOpen}>
          <div>Home</div>
          <div>Book</div>
          <div>Bookmark</div>
        </Menu>

        {/* Pass the isOpen prop to Hamburger */}
        <Hamburger isOpen={isMenuOpen} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </Hamburger>
      </Nav>

      <div>Main Content</div>
      <div>Footer</div>
      <Button>Click me!</Button>
    </div>
  );
};

export default Home;
