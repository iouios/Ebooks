"use client";
import styled from "styled-components";
import Link from 'next/link';

const HomePage = () => {
  return (
    <Container>
      <div>
        <h1>ยินดีต้อนรับสู่บล็อกของฉัน</h1>
        <ul>
          <li>
            <Link href="/book/1">ไปยังหนังสือ 1</Link>
          </li>
          <li>
            <Link href="/book/2">ไปยังหนังสือ 2</Link>
          </li>
          <li>
            <Link href="/book/3">ไปยังหนังสือ 3</Link>
          </li>
        </ul>
      </div>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  width: 100%;
  height: 100vh;
`;

export default HomePage;
