"use client";
import styled from "styled-components";
import Image from "next/image";

const HomePage = () => {
  return (
    <Container>
      <ImageContainer>
        <OverlayText>
          The Book Lover&apos;s Dreamland Awaits!
        </OverlayText>
        <Text>
          Welcome to the ultimate book lover&apos;s paradise! Join our community and contribute to the ever-evolving library of stories, where every book has a chance to inspire someone new.
        </Text>
        <StyledImage src="/images/Book.png" alt="Profile" fill priority />
      </ImageContainer>
      <ContentContainer>
        <TextOur>Our Best Picks</TextOur>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const OverlayText = styled.div`
  position: absolute;
  top: 5%;  /* ขยับให้อยู่ตรงกลางของภาพ */
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FF7700;
  font-size: 40px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: 80%; /* ป้องกันข้อความล้นขอบ */
`;

const Text = styled.div`
  position: absolute;
  top: 15%; 
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  text-align: center;
  width: 80%;
`;

const ContentContainer = styled.div`
  padding: 20px;
  min-height: 50vh;
  overflow-y: auto;
  background-color: var(--FONT_WHITE);
  color: #333;
`;

const TextOur = styled.div`
  font-size: 40px;
  font-weight: bold;
  text-align: center; 
  width: 100%; 
  margin-top: 80px;
`;


export default HomePage;
