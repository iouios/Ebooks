"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client"; 

interface BookmarkButtonProps {
  book_id: number;
  isBookmarked: boolean;
  setBookmarkList: React.Dispatch<React.SetStateAction<number[]>>;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  book_id,
  setBookmarkList,
}) => {
  const { user } = useUser(); 
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getBookmarks = (): number[] => {
    if (!user) return [];

    const storedBookmarks = localStorage.getItem("bookmarks");
    if (!storedBookmarks) return [];

    try {
      const bookmarks = JSON.parse(storedBookmarks);
      const userBookmark = bookmarks.find((b: { id: string }) => b.id === user.sub);
      return userBookmark ? userBookmark.book_id : [];
    } catch (err) {
      console.error("Error parsing bookmarks:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!user) return;
    const bookmarkIds = getBookmarks();
    setBookmarkList(bookmarkIds);
    setIsBookmarked(bookmarkIds.includes(book_id));
  }, [book_id, user, setBookmarkList]);

  const handleBookmark = () => {
    if (!user) {
      if (window.confirm("กรุณาเข้าสู่ระบบก่อนบันทึก Bookmark")) {
        window.location.href = "/api/auth/login"; 
      }
      return;
    }
    const storedBookmarks = localStorage.getItem("bookmarks");
    const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

    let userBookmark = bookmarks.find((b: { id: string }) => b.id === user.sub);

    if (userBookmark) {

      if (userBookmark.book_id.includes(book_id)) {
        userBookmark.book_id = userBookmark.book_id.filter((id: number) => id !== book_id);
      } else {
        userBookmark.book_id.push(book_id);
      }
    } else {
 
      userBookmark = { id: user.sub, book_id: [book_id] };
      bookmarks.push(userBookmark);
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setBookmarkList(userBookmark.book_id);
    setIsBookmarked(userBookmark.book_id.includes(book_id));
  };

  console.log(user)

  return (
    <ButtonContainer onClick={handleBookmark} $isBookmarked={isBookmarked}>
      {isBookmarked ? (
        <Buttombookmarkopen>
          <Icon>
            <Image
              src="/images/Bookmarkicon.png"
              alt="Bookmarked"
              width={20}
              height={20}
            />
          </Icon>
          <Textcolor>Bookmark</Textcolor>
        </Buttombookmarkopen>
      ) : (
        <Buttombookmark>
          <Icon>
            <Image
              src="/images/Bookmark.png"
              alt="Bookmark"
              width={20}
              height={20}
            />
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
