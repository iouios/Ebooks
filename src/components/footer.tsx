"use client";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <Footers>
        <div>© 2025 | Gutendex BookPoint</div>
        <Textcolorfooter>
          Visit our branches in Galle, Kurunegala, Kandy, and Colombo, and
          register for our online platform to enjoy maximum benefits!
        </Textcolorfooter>
      </Footers>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  position: relative; /* เพิ่ม position relative */
  @media (max-width: 500px) {
    display: none;
  }
`;

const Footers = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--FONT_BLACK);
  color: var(--FONT_WHITE);
  padding: 12px 20px;
  height: 200px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000; /* เพิ่ม z-index เพื่อให้ Footer อยู่ด้านบน */
  
  &::before {
    content: "";
    position: absolute;
    top: 30%; 
    left: 50%; 
    width: 90%; 
    height: 2px;
    background-color: var(--FONT_WHITE);
    transform: translateX(-50%); 
  }

  @media (min-width: 500px) {
    justify-content: center;
    gap: 30px;
  }
`;

const Textcolorfooter = styled.footer`
  color: var(--FONT_YELLOW);
  margin: 10px;
`;

export default Footer;
