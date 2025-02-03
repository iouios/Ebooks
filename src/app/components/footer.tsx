"use client";
import styled from "styled-components";

const Footer = () => {

  return (
    <div>
      <Footers>
        <div>© 2025 | Gutendex BookPoint</div>
        <Textcolorfooter>
          Visit our branches in Galle, Kurunegala, Kandy, and Colombo, and
          register for our online platform to enjoy maximum benefits!
        </Textcolorfooter>
      </Footers>
    </div>
  );
};



const Footers = styled.nav`
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


const Textcolorfooter = styled.nav`
  color: var(--FONT_YELLOW);
  }
`;

export default Footer;
