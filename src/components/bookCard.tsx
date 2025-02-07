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
    data.title.length > 10 ? data.title.substring(0, 20) + "..." : data.title;

  const truncatedAuthors = data.authors.map((author) => author.name).join(", ");
  const truncatedAuthorsText =
    truncatedAuthors.length > 20
      ? truncatedAuthors.substring(0, 20) + "..."
      : truncatedAuthors;

  const summaryText = data.summaries?.[0] || "ไม่มีเรื่องย่อ";
  const truncatedSummary =
    summaryText.length > 10
      ? summaryText.substring(0, 20) + "..."
      : summaryText;

  return (
    <Card>
      <Images>
        <CoverImage
          src={data.formats?.["image/jpeg"] || "/default-cover.jpg"}
          alt={data.title}
        />
      </Images>
      <Content>
        <SetTitle>
          <Title>{truncatedTitle}</Title>
          <AuthorTitle>{truncatedAuthorsText || "ไม่ทราบ"}</AuthorTitle>
          <Paragraph>
            <strong>languages:</strong>{" "}
            {data.languages?.join(", ") || "ไม่ระบุ"}
          </Paragraph>
          <Paragraph>{truncatedSummary}</Paragraph>
        </SetTitle>
        <SetBookmark>
          <BookmarkButton id={data.id} book_id={data.id} />
        </SetBookmark>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid var(--FONT_BLACK);
  // padding: 20px;
  background-color: var(--FONT_WHITE);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 8px;

  justify-content: center;
  align-items: center;
  gap: 20px;
  font-weight: bold;
`;

const CoverImage = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--FONT_BLACK);
  box-shadow: 0 2px 4px rgba(0, 0.5, 0.5, 0.5);
  margin-top: 50px;
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
  color: var(--FONT_BLACK);
  padding-top: 20px;
`;

const Paragraph = styled.p`
  font-size: 1em;
  color: var(--FONT_BROWN);
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorTitle = styled.p`
  font-size: 1.6em;
  margin-bottom: 1px;
  color: var(--FONT_GRAY);
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 20px;
`;

const SetTitle = styled.div`
  justify-content: center;
  align-items: center;
  text-align: start;
  margin-left: 20px;
`;

const SetBookmark = styled.div`
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
`;

export default BookCard;
