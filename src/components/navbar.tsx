"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./logout";

interface MenuProps {
  $isMenuOpen: boolean;
}

interface HamburgerProps {
  $isOpen: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
        <Link href="/" passHref>
          <Button $isActive={pathname === "/"}>Home</Button>
        </Link>
        <Link href="/book" passHref>
          <Button $isActive={pathname === "/book"}>Book</Button>
        </Link>
        <Link href="/bookmark" passHref>
          <Button $isActive={pathname === "/bookmark"}>Bookmark</Button>
        </Link>
      </Menu>
      <Icon>
        <Icon>
          <Logout />
        </Icon>
      </Icon>
      <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
        {!isMenuOpen ? (
          <Image src="/images/icon.png" alt="Menu" width={20} height={20} />
        ) : (
          <Image src="/images/Vector.png" alt="Close" width={20} height={20} />
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
    grid-template-columns: 1fr 1fr;
    height: 100px;
  }

  justify-content: flex-start;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  padding-right: 350px;

  @media (max-width: 500px) {
    padding-right: 0px;
  }
`;

const Text = styled.div`
  padding-left: 10px;
`;

const TextcolorNav = styled.div`
  color: var(--FONT_YELLOW);
  font-size: 24px;
  font-weight: bold;

  @media (max-width: 500px) {
    font-size: 16px;
  }
`;
{/* height รอแก้ความสูง */}
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
    height: 100vh; 
    background-color: var(--FONT_BLACK);
    padding: 20px;
    z-index: 1000;
    text-align: center;
  }
`;

const Button = styled.button<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? "var(--FONT_YELLOW)" : "white")};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: var(--FONT_YELLOW);
  }
`;

const Hamburger = styled.div<HamburgerProps>`
  display: none;
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

const ResponsiveImage = styled(Image)`
  width: auto;
  height: auto;

  @media (max-width: 500px) {
    width: 120px;
    height: 60px;
  }
`;

export default Navbar;
