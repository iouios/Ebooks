"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
      <Flex>
        <ResponsiveImage
          src="/images/Rectangle 3.png"
          alt="Logo"
          width={160}
          height={50}
        />
        <Text>
          <TextcolorNav>Gutendex</TextcolorNav>
          <TextcolorNav>BOOKPOINT</TextcolorNav>
        </Text>
      </Flex>

      <Menu $isMenuOpen={isMenuOpen}>
      <Link href="/">
        <Button>Home</Button>
        </Link>
        <Link href="/book">
        <Button>Book</Button>
        </Link>
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

      <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
        {!isMenuOpen ? (
          <Image
            src="/images/icon.png"
            alt="Profile"
            width={20}
            height={20}
          />
        ) : (
          <Image
            src="/images/Vector.png"
            alt="Close"
            width={20}
            height={20}
          />
        )}
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
  height: 119px;

  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    height: 100px;
  }

  /* Align Grid2 to left */
  justify-content: flex-start; 
`;

const Flex = styled.div`
  display: flex;
  justify-content: flex-start;  
  align-items: center;  
  margin-right: 0;
    padding-bottom: 10px;

  @media (max-width: 500px) {
    margin-right: 0;
  }
`;

const Text = styled.div`
  margin-top: 10px;
  padding-left: 10px;
  padding-bottom: 10px;
  @media (max-width: 500px) {
    margin-top: 0px;
  }
`;

const TextcolorNav = styled.div`
  color: var(--FONT_YELLOW);
  font-size: 24px;
   font-weight: bold; 
 

  @media (max-width: 500px) {
    font-size: 16px;
     font-weight: bold; 
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
    right: 0px;
    width: 200px;
    height: 100%;
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

  @media (max-width: 500px) {
    display: flex;
    margin-left: 100px;
  }
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
  width: auto;
  height: auto;

  @media (max-width: 500px) {
    width: 120px;  
    height: 60px;  
  }
`;

export default Navbar;
