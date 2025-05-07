"use client";
import React from "react";
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
  isBookmarked,
  setBookmarkList,
}) => {
  const { user } = useUser();

  const handleBookmark = async () => {
    if (!user) {
      if (window.confirm("กรุณาเข้าสู่ระบบก่อนบันทึก Bookmark")) {
        window.location.href = "/api/auth/login";
      }
      return;
    }

    try {
      const endpoint = isBookmarked
        ? `/api/bookmark/remove/${book_id}`
        : `/api/bookmark/add/${book_id}`;

      const method: 'POST' | 'DELETE' = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.sub!, bookId: book_id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert(`Error: ${errorData.message}`);
        return;
      }

      // อัปเดตรายการ bookmark
      setBookmarkList((prev) =>
        isBookmarked ? prev.filter((id) => id !== book_id) : [...prev, book_id]
      );
    } catch (error) {
      console.error("Bookmark action error:", error);
      alert("เกิดข้อผิดพลาดในการดำเนินการกับ Bookmark");
    }
  };

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

// Styled components คงเดิม
const ButtonContainer = styled.button<{ $isBookmarked: boolean }>`
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  padding: 0px;
  @media (max-width: 500px) {
    font-size: 10px;
  }
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
  @media (max-width: 500px) {
    padding-right: 25px;
    padding-left: 15px;
  }
`;

const Textcolors = styled.div`
  align-items: center;
  padding-right: 70px;
  padding-left: 20px;
  @media (max-width: 500px) {
    padding-right: 25px;
    padding-left: 15px;
  }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  padding-left: 15px;
  padding-right: 20px;

  @media (max-width: 500px) {
    padding-right: 0px;
    padding-left: 5px;

    img {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export default BookmarkButton;
