"use client";
import Link from "next/link";
import { NextPage } from "next";
import styled from "styled-components";

const NotFoundPage: NextPage = () => {
  return (
    <Container>
      <Card>
        <Title>404 - Page Not Found</Title>
        <Message>ขออภัย ไม่พบหน้าที่คุณต้องการ</Message>
        <HomeLink href="/">กลับหน้าแรก</HomeLink>
      </Card>
    </Container>
  );
};

export default NotFoundPage;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Card = styled.div`
  background: #222; /* สีการ์ด */
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #ffcc00; /* สีข้อความ */
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background: #ffcc00;
  color: #222;
  text-decoration: none;
  font-weight: bold;
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: #e6b800;
  }
`;
