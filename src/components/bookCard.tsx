"use client";
import React from "react";
import styled from "styled-components";
import BookmarkButton from "./bookmarkButton";
import Link from "next/link";


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
  bookmarkList: number[];
  setBookmarkList: React.Dispatch<React.SetStateAction<number[]>>;
}

const BookCard: React.FC<BookCardProps> = ({
  data,
  bookmarkList,
  setBookmarkList,
}) => {
  const isBookmarked = bookmarkList.includes(data.id);

  return (
    <Card>
      <Images>
      <Link href={`/book/${data.id}`}>
      {/* <Link href="/about"> */}
        <CoverImage
          src={data.formats?.["image/jpeg"] || "/default-cover.jpg"}
          alt={data.title}
        />
        </Link>
      </Images>
      <Content>
        <SetTitle>
          <Title>
            {data.title.length > 20
              ? data.title.substring(0, 20) + "..."
              : data.title}
          </Title>
          <AuthorTitle>
            {data.authors
              .map((author) => author.name)
              .join(", ")
              .substring(0, 20) + "..."}
          </AuthorTitle>
          <Paragraph>
            <strong>Languages:</strong>{" "}
            {data.languages?.join(", ") || "ไม่ระบุ"}
          </Paragraph>
          <Paragraph>
            {data.summaries?.[0]?.substring(0, 20) + "..." || "ไม่มีเรื่องย่อ"}
          </Paragraph>
        </SetTitle>
        <SetBookmark>
          <BookmarkButton
            id={data.id}
            book_id={data.id}
            isBookmarked={isBookmarked}  
            setBookmarkList={setBookmarkList}
          />
        </SetBookmark>
      </Content>
    </Card>
  );
};

const Card = styled.div`
  border: 1px solid var(--FONT_BLACK);
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
  font-size: 20px;
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
  font-size: 16px;
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
