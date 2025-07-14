"use client";
import React from "react";
import styled from "styled-components";
import { useUser } from "@auth0/nextjs-auth0/client";
import BookmarkIcon from "../../icon/bookmark";

interface BookmarkButtonProps {
  book_id: number | string;
  isBookmarked: boolean;
  setBookmarkList: React.Dispatch<React.SetStateAction<(number | string)[]>>;
}

const BookmarkButtonEbook: React.FC<BookmarkButtonProps> = ({
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

      const method: "POST" | "DELETE" = isBookmarked ? "DELETE" : "POST";

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
            <BookmarkIcon color="white" />
          </Icon>
          <Textcolor>Bookmark</Textcolor>
        </Buttombookmarkopen>
      ) : (
        <Buttombookmark>
          <Icon>
            <BookmarkIcon />
          </Icon>
          <Textcolors>Bookmark</Textcolors>
        </Buttombookmark>
      )}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<{ $isBookmarked: boolean }>`
  cursor: pointer;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  padding: 0px;
  @media (max-width: 500px) {
    font-size: 10px;
    width: 65%;
  }
`;

const Buttombookmarkopen = styled.div`
  display: flex;
  background-color: var(--FONT_YELLOW);
  border: 2px solid var(--FONT_YELLOW);
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 10px;
`;

const Buttombookmark = styled.div`
  display: flex;
  padding: 5px;
  border: 2px solid var(--FONT_YELLOW);
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Textcolor = styled.div`
  color: var(--FONT_WHITE);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  margin-right: 5px;
  @media (max-width: 500px) {
    font-size: 8px;
  }
`;

const Textcolors = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  text-align: center;
  margin-right: 5px;
  @media (max-width: 500px) {
    font-size: 8px;
  }
`;
const Icon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 500px) {
    padding-left: 5px;

    svg {
      width: 10px;
      height: 10px;
    }
  }
`;




export default BookmarkButtonEbook;
