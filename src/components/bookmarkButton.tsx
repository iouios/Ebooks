import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";

interface BookmarkButtonProps {
  id: number;
  book_id: number;
  setBookmarkList: React.Dispatch<React.SetStateAction<number[]>>;
  isBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  id,
  book_id,
  setBookmarkList,
  isBookmarked,
}) => {
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    const updatedBookmarks: { id: number; book_id: number[] }[] =
      storedBookmarks ? JSON.parse(storedBookmarks) : [];

    const bookmarkIds = updatedBookmarks.map((item) => item.book_id).flat();
    setBookmarkList(bookmarkIds);

    const isBookmarkedNow = bookmarkIds.includes(book_id);
    setIsBookmarkedState(isBookmarkedNow);
  }, [book_id, setBookmarkList]);

  const handleBookmark = () => {
    const storedBookmarks = localStorage.getItem("bookmarks");

    const updatedBookmarks: { id: number; book_id: number[] }[] =
      storedBookmarks ? JSON.parse(storedBookmarks) : [];

    const bookmarkIndex = updatedBookmarks.findIndex(
      (bookmark) => bookmark.id === id
    );

    if (bookmarkIndex !== -1) {
      const currentBookmark = updatedBookmarks[bookmarkIndex];

      if (currentBookmark.book_id.includes(book_id)) {
        currentBookmark.book_id = currentBookmark.book_id.filter(
          (book) => book !== book_id
        );
      } else {
        currentBookmark.book_id.push(book_id);
      }

      if (currentBookmark.book_id.length === 0) {
        updatedBookmarks.splice(bookmarkIndex, 1);
      }
    } else {
      updatedBookmarks.push({
        id: id,
        book_id: [book_id],
      });
    }

    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));

    const allBookIds = updatedBookmarks
      .map((bookmark) => bookmark.book_id)
      .flat();

    setBookmarkList(allBookIds);

    const isBookmarkedNow = allBookIds.includes(book_id);

    setIsBookmarkedState(isBookmarkedNow);
  };

  return (
    <ButtonContainer onClick={handleBookmark} $isBookmarked={isBookmarkedState}>
      {isBookmarkedState ? (
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
