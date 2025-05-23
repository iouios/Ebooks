"use client";
import React from "react";
import styled from "styled-components";
import BookmarkButton from "../client/bookmarkButton";
import Link from "next/link";

interface Author {
  name: string;
}

interface Book {
  id: number | string;
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
  bookmarkList: (number | string)[];  // <-- แก้ตรงนี้
  setBookmarkList: React.Dispatch<React.SetStateAction<(number | string)[]>>; // <-- แก้ตรงนี้
  onBookmarkClick?: () => void;
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
  background-color: var(--FONT_WHITE);
  box-shadow: 0 2px 4px var(--ELEMENT_GRAY);
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  @media (max-width: 500px) {
    width: 140px;
    height: 300px;
    font-weight: bold;
  }
`; //width: 160px;

const CoverImage = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid var(--FONT_BLACK);
  box-shadow: 0 2px 4px rgba(0, 0.5, 0.5, 0.5);
  margin-top: 50px;
  @media (max-width: 500px) {
    width: 80px;
    height: 130px;
    margin-top: 25px;
  }
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
  @media (max-width: 500px) {
    padding: 0px;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  color: var(--FONT_BLACK);
  padding-top: 20px;
  @media (max-width: 500px) {
    font-size: 10px;
    padding-top: 10px;
  }
`;

const Paragraph = styled.p`
  font-size: 1em;
  color: var(--FONT_BROWN);
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 500px) {
    font-size: 10px;
  }
`;

const AuthorTitle = styled.p`
  font-size: 16px;
  margin-bottom: 1px;
  color: var(--FONT_GRAY);
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 20px;
  @media (max-width: 500px) {
    font-size: 10px;
    padding-bottom: 10px;
  }
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
