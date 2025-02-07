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
  summaries: string[];
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
  const truncatedTitle =
    data.title.length > 10 ? data.title.substring(0, 10) + "..." : data.title;

  const truncatedAuthors = data.authors
    .map((author) => author.name)
    .join(", ");
  const truncatedAuthorsText =
    truncatedAuthors.length > 10
      ? truncatedAuthors.substring(0, 10) + "..."
      : truncatedAuthors;

  const summaryText = data.summaries?.[0] || "ไม่มีเรื่องย่อ";
  const truncatedSummary =
    summaryText.length > 10 ? summaryText.substring(0, 10) + "..." : summaryText;

  return (
    <Card>
      <Content>
        <Images>
          <CoverImage
            src={data.formats?.["image/jpeg"] || "/default-cover.jpg"}
            alt={data.title}
          />
        </Images>
        <Title>
          <strong>ชื่อ:</strong> {truncatedTitle}
        </Title>
        <Paragraph>
          <strong>ผู้เขียน:</strong> {truncatedAuthorsText || "ไม่ทราบ"}
        </Paragraph>
        <Paragraph>
          <strong>ภาษา:</strong> {data.languages?.join(", ") || "ไม่ระบุ"}
        </Paragraph>
        <Paragraph>
          <strong>เรื่องย่อ:</strong> {truncatedSummary}
        </Paragraph>
        <BookmarkButton id={data.id} book_id={data.id} />
      </Content>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid var(--FONT_BLACK);
  padding: 20px;
  background-color: var(--FONT_WHITE);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const CoverImage = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--FONT_BLACK);
`;

const Images = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 1.6em;
  margin-bottom: 10px;
  color: #333;
  padding-top: 20px;
`;

const Paragraph = styled.p`
  font-size: 1em;
  margin-bottom: 8px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default BookCard;
