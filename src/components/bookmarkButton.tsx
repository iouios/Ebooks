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
     
      const userBookmark = parsedBookmarks.find((bookmark: { id: number }) => bookmark.id === id);
      if (userBookmark && userBookmark.book_id.includes(book_id)) {
        setIsBookmarked(true);
      }
    }
  }, [book_id, id]);

  
  const handleBookmark = () => {
    const bookmarks = localStorage.getItem("bookmarks");
    let parsedBookmarks: { id: number; book_id: number[] }[] = [];

    if (bookmarks) {
      parsedBookmarks = JSON.parse(bookmarks); 
    }

    
    const userBookmarkIndex = parsedBookmarks.findIndex((bookmark) => bookmark.id === id);

    if (userBookmarkIndex === -1) {
      
      parsedBookmarks.push({ id, book_id: [book_id] });
    } else {
     
      const userBookmark = parsedBookmarks[userBookmarkIndex];

      if (!userBookmark.book_id.includes(book_id)) {
        userBookmark.book_id.push(book_id); 
      } else {
        userBookmark.book_id = userBookmark.book_id.filter((id) => id !== book_id); // ลบ book_id
      }
    }

    
    localStorage.setItem("bookmarks", JSON.stringify(parsedBookmarks));
    setIsBookmarked(!isBookmarked); 
  };

  return (
    <ButtonContainer onClick={handleBookmark} $isBookmarked={isBookmarked}>
      {isBookmarked ? (
        <Buttombookmarkopen>
          <Icon>
            <Image src="/images/Bookmarkicon.png" alt="Profile" width={20} height={20} />
          </Icon>
          <Textcolor>Bookmarked</Textcolor>
        </Buttombookmarkopen>
      ) : (
        <Buttombookmark>
          <Icon>
            <Image src="/images/Bookmark.png" alt="Profile" width={20} height={20} />
          </Icon>
          <Textcolors>Bookmark</Textcolors>
        </Buttombookmark>
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<{ $isBookmarked: boolean }>`
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
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
  align-items: center;
  padding-right: 70px;
  padding-left: 20px;
`;

const Textcolors = styled.div`
  align-items: center;
  padding-right: 70px;
  padding-left: 20px;
`;

const Icon = styled.div`
  align-items: center;
  padding-left: 15px;
  padding-right: 20px;
`;

export default BookmarkButton;
