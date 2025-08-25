"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";


export default function TokenStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") {
      setTimeout(() => {
        router.push("/Token");
      }, 3000);
    }
  }, [status, router]);

  return (
    <Container>
      {status === "success" ? (
        <MessageSuccess >
          Payment Success
        </MessageSuccess>
      ) : (
        <>
          <MessageFailed>Payment Failed</MessageFailed>
          <Button onClick={() => router.push("/Token")}>ลองจ่ายใหม่</Button>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const MessageSuccess = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color:green;
`;

const MessageFailed = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color:red;
`;

const Button = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;