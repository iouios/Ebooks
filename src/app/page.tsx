"use client";
import styled from "styled-components";
import { useState } from "react";
import Image from "next/image";

interface MenuProps {
  $isMenuOpen: boolean; // Transient prop
}

interface HamburgerProps {
  $isOpen: boolean; // Transient prop for Hamburger
}

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div>
      <Nav>
        <Grid2>
          <div>
            <Image
              src="/images/Rectangle 3.png"
              alt="description of image"
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

        <Icon><Image
              src="/images/Rectangle 4.png"
              alt="description of image"
              width={20}
              height={20}
            /></Icon>
        <Hamburger $isOpen={isMenuOpen} onClick={toggleMenu}>
          <div />
          <div />
          <div />
        </Hamburger>
      </Nav>

      <div>Main Content</div>
      <Footer>
        <div>© 2025 | Gutendex BookPoint</div>
        <Textcolorfooter>
          Visit our branches in Galle, Kurunegala, Kandy, and Colombo, and
          register for our online platform to enjoy maximum benefits!
        </Textcolorfooter>
      </Footer>
    </div>
  );
};

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 คอลัมน์ในจอใหญ่ */
  justify-items: center;
  align-items: center;
  background-color: var(--FONT_BLACK);
  color: white;
  padding: 12px 20px;
  gap: 10px;
  width: 1280px;
  height: 119px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr; /* 2 คอลัมน์ในจอเล็ก */
    gap: 20px; /* เพิ่มช่องว่างระหว่างคอลัมน์ */
  }
`;

const Footer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--FONT_BLACK);
  color: white;
  padding: 12px 20px;
  height: 250px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 30%;
    left: %;
    width: 95%;
    height: 2px;
    background-color: var(--FONT_WHITE);
  }

  @media (min-width: 500px) {
    justify-content: center;
    gap: 30px;
  }
`;

const Grid2 = styled.nav`
    display: grid;
  grid-template-columns: 1fr 1fr;
  margin-right: 50%;
  }
`;

const Textcenter = styled.div`
  text-align: center;
  margin-top: 10%;
`;


const TextcolorNav = styled.nav`
  color: var(--FONT_YELLOW);
  font-size: 20px;
  }
`;

const Textcolorfooter = styled.nav`
  color: var(--FONT_YELLOW);
  }
`;

const Menu = styled.div<MenuProps>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  @media (max-width: 500px) {
    display: ${(props) => (props.$isMenuOpen ? "flex" : "none")};
    position: absolute;
    top: 50px;
    right: 0;
    width: 200px;
    height: 100%;
    background-color: #282c34;
    padding: 20px;
    z-index: 1000;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
    text-align: center;
    display: grid;
  }
`;

const Hamburger = styled.div<HamburgerProps>`
  display: none;
  flex-direction: column;
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

  ${(props) =>
    props.$isOpen &&
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

const Icon = styled.div`
  margin-left: 50%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Button = styled.button`
  color: white; /* สีตัวอักษร */
  cursor: pointer;
`;

export default Home;
