"use client";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./logout";
import { useUser } from "@auth0/nextjs-auth0/client";

interface MenuProps {
  $isMenuOpen: boolean;
}

interface HamburgerProps {
  $isOpen: boolean;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
    const { user } = useUser();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
      <HamburgerWrapper>
        <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
          {!isMenuOpen ? (
            <Image src="/images/icon.png" alt="Menu" width={20} height={20} />
          ) : null}
        </Hamburger>
        <Menu $isMenuOpen={isMenuOpen}>
          <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
            <Image
              src="/images/Vector.png"
              alt="Close"
              width={20}
              height={20}
            />
          </Hamburger>
          <LogoutImage>
            <Logout />
          </LogoutImage>
          <div className="text-center">
          <Link href="/" passHref>
            <Button $isActive={pathname === "/"}>Home</Button>
          </Link>
          </div>
          <div className="text-center">
          <Link href="/book" passHref>
            <Button $isActive={pathname === "/book"}>Public Library</Button>
          </Link>     
          </div>    
          <div className="text-center">
          <Link href="/EbookShop" passHref>
            <Button $isActive={pathname === "/EbookShop"}>Premium Books</Button>
          </Link>
          </div>
          <Link
            href={user ? "/bookmark" : "#"}
            passHref
            onClick={(e) => {
              if (!user) {
                e.preventDefault(); 
                alert("กรุณาเข้าสู่ระบบเพื่อเข้าถึง Bookmark");
                window.location.href = "/api/auth/login"; // ไปที่หน้า Login
              }
            }}
          >
            <Button $isActive={pathname === "/bookmark"}>Bookmark</Button>
          </Link>
          
        </Menu>
      </HamburgerWrapper>
      <Icon>
        <Icon>
          <Logout />
        </Icon>
      </Icon>
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

const Menu = styled.div<MenuProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  
  gap: 20px;

  @media (max-width: 500px) {
    display: ${(props) => (props.$isMenuOpen ? "flex" : "none")};
    flex-direction: column;
    position: fixed; /* Changed from absolute to fixed */
    top: 0px; /* Keep the menu below the header */
    right: 0px;
    width: 200px;
    height: 100vh;
    background-color: var(--FONT_BLACK);
    padding: 20px;
    z-index: 1000;
    text-align: center;
    overflow-y: auto; /* To make sure the content can scroll within the menu if needed */
  }
`;

const Button = styled.button<{ $isActive: boolean }>`
  color: ${({ $isActive }) => ($isActive ? "var(--FONT_YELLOW)" : "white")};
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  text-justify: center;
  &:hover {
    color: var(--FONT_YELLOW);
  }
`;

const HamburgerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Hamburger = styled.div<HamburgerProps>`
  display: none;
  cursor: pointer;
  width: 15px;
  height: 15px;

  @media (max-width: 500px) {
    display: flex;
    margin-left: 150px;
    margin-top: 10px;
    margin-bottom: 5px;
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

const LogoutImage = styled.div`
  @media (min-width: 500px) {
    display: none;
  }
`;

export default Navbar;
