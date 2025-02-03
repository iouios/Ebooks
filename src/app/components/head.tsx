"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";

interface MenuProps {
  $isMenuOpen: boolean;
}

interface HamburgerProps {
  $isOpen: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <Nav>
      <Grid2>
        <div>
          <ResponsiveImage
            src="/images/Rectangle 3.png"
            alt="Logo"
            width={104}
            height={98}
          />
        </div>
        <Textcenter>
          <TextcolorNav>Gutendex</TextcolorNav>
          <TextcolorNav>BOOKPOINT</TextcolorNav>
        </Textcenter>
      </Grid2>

      <Menu $isMenuOpen={isMenuOpen}>
        <Button>Home</Button>
        <Button>Book</Button>
        <Button>Bookmark</Button>
      </Menu>

      <Icon>
        <Image
          src="/images/Rectangle 4.png"
          alt="Profile"
          width={50}
          height={50}
        />
      </Icon>

      {/* Hamburger Button */}
      <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </Hamburger>
    </Nav>
  );
};

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: center;
  background-color: var(--FONT_BLACK);
  color: white;
  padding: 12px 20px;
  gap: 10px;
  width: 100%;
  max-width: 1280px;
  height: 119px;

  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    height: 100px;
  }
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-right: 50%;
    @media (max-width: 500px) {
    margin-right: 0%;
  }
`;

const Textcenter = styled.div`
  text-align: center;
  margin-top: 10%;
`;

const TextcolorNav = styled.div`
  color: var(--FONT_YELLOW);
  font-size: 20px;

  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const Menu = styled.div<MenuProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  @media (max-width: 500px) {
    display: ${(props) => (props.$isMenuOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 70px;
    bottom: 0;
    right: 0px;
    width: 200px;
    height: px;
    background-color: var(--FONT_BLACK);
    padding: 20px;
    z-index: 1000;
    text-align: center;
    margin-top: 35px;
  }
`;

const Hamburger = styled.div<HamburgerProps>`
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  width: 40px;
  height: 30px;
  

  div {
    width: 100%;
    height: 4px;
    background-color: white;
    transition: all 0.3s ease-in-out;
  }

  @media (max-width: 768px) {
    display: flex;
    margin-left: 150px;
  }

  ${(props) =>
    props.$isOpen &&
    `
    div:nth-child(1) {
      transform: rotate(45deg) translateY(10px);
    }
    div:nth-child(2) {
      opacity: 0;
    }
    div:nth-child(3) {
      transform: rotate(-45deg) translateY(-10px);
    }
  `}
`;

const Icon = styled.div`
  @media (max-width: 500px) {
    display: none;
  }
`;

const Button = styled.button`
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const ResponsiveImage = styled(Image)`
  width: 104px;
  height: 60px;

  @media (max-width: 500px) {
    width: 150px;
    height: 80px;
  }
`;


export default Navbar;
