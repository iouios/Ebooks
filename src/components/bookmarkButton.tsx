"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
interface BookmarkButtonProps {
  id: number;
  book_id: number;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ id, book_id }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = localStorage.getItem("bookmarks");
    if (bookmarks) {
      const parsedBookmarks = JSON.parse(bookmarks);
      if (
        parsedBookmarks[id] &&
        parsedBookmarks[id].book_id.includes(book_id)
      ) {
        setIsBookmarked(true);
      }
    }
  }, [id, book_id]);

  const handleBookmark = () => {
    const bookmarks = localStorage.getItem("bookmarks");
    let parsedBookmarks: Record<number, { book_id: number[] }> = {};

    if (bookmarks) {
      parsedBookmarks = JSON.parse(bookmarks);
    }

    if (!parsedBookmarks[id]) {
      parsedBookmarks[id] = { book_id: [book_id] };
    } else {
      const index = parsedBookmarks[id].book_id.indexOf(book_id);
      if (index === -1) {
        parsedBookmarks[id].book_id.push(book_id);
      } else {
        parsedBookmarks[id].book_id.splice(index, 1);
      }
    }

    localStorage.setItem("bookmarks", JSON.stringify(parsedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  return (
    <ButtonContainer onClick={handleBookmark} $isBookmarked={isBookmarked}>
      {isBookmarked ? (
        <>
          <Buttombookmarkopen>
            <Icon>
              <Image
                src="/images/Bookmarkicon.png"
                alt="Profile"
                width={20}
                height={20}
              />
            </Icon>
            <Textcolor>Bookmark</Textcolor>
          </Buttombookmarkopen>
        </>
      ) : (
        <>
          <Buttombookmark>
            <Icon>
              <Image
                src="/images/Bookmark.png"
                alt="Profile"
                width={20}
                height={20}
              />
            </Icon>
            <Textcolors>Bookmark</Textcolors>
          </Buttombookmark>
        </>
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<{ $isBookmarked: boolean }>`
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
`;

const Buttombookmarkopen = styled.div`
  display: flex;
  background-color: var(--FONT_YELLOW);
  border: 2px solid var(--FONT_YELLOW);
  border-radius: 8px;
  padding: 5px;
`;

const Buttombookmark = styled.div`
  display: flex;
  padding: 5px;
  border: 2px solid var(--FONT_YELLOW);
  border-radius: 8px;
`;

const Textcolor = styled.div`
  color: var(--FONT_WHITE);
  text-align: left;
`;
const Textcolors = styled.div`
  text-align: left;
`;

const Icon = styled.div`
  padding-right: 40px;
  padding-left: 20px;
`;


export default BookmarkButton;
