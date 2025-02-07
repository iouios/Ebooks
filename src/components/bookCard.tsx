"use client";
import React from "react";
import styled from "styled-components";
import BookmarkButton from "./bookmarkButton";

interface Author {
  name: string;
}

interface Book {
  id: number;
  title: string;
  authors: Author[];
  languages: string[];
  subjects: string[];
  download_count: number;
  coverImage?: string;
  formats: {
    "text/plain"?: string;
    "application/epub+zip"?: string;
    "image/jpeg"?: string;
  };
}

interface BookCardProps {
  data: Book;
}

const BookCard: React.FC<BookCardProps> = ({ data }) => {
  return (
    <Card>
      
      <CoverImage
        src={data.formats?.["image/jpeg"] || "/default-cover.jpg"}
        alt={data.title}
      />
      <Content>
        <Title>
          <strong>ชื่อ:</strong> {data.title}
        </Title>
        <Paragraph>
          <strong>ผู้เขียน:</strong>{" "}
          {data.authors?.map((author) => author.name).join(", ") || "ไม่ทราบ"}
        </Paragraph>
        <Paragraph>
          <strong>ภาษา:</strong> {data.languages?.join(", ") || "ไม่ระบุ"}
        </Paragraph>

        <BookmarkButton id={data.id} book_id={data.id}  />
      </Content>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  gap: 20px; /* เพิ่มระยะห่างระหว่างรูปกับข้อความ */
  align-items: flex-start;
`;

const CoverImage = styled.img`
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 1.6em;
  margin-bottom: 10px;
  color: #333;
`;

const Paragraph = styled.p`
  font-size: 1em;
  margin-bottom: 8px;
  color: #555;
`;

export default BookCard;
