import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";

interface BookmarkButtonProps {
  book_id: number;
  setBookmarkList: React.Dispatch<React.SetStateAction<number[]>>;
  isBookmarked: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  book_id,
  setBookmarkList,
  isBookmarked,
}) => {
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

  const getBookmarkIds = (): number[] => {
    const storedBookmarks = localStorage.getItem("bookmarks");
    let bookmarkIds: number[] = [];
    if (storedBookmarks) {
      const parsedData = JSON.parse(storedBookmarks);
      if (
        Array.isArray(parsedData) &&
        parsedData.length > 0 &&
        typeof parsedData[0] === "object" &&
        parsedData[0].book_id
      ) {
        bookmarkIds = parsedData.map(
          (item: { book_id: number[] }) => item.book_id[0]
        );
      } else {
        bookmarkIds = parsedData;
      }
    }
    return bookmarkIds;
  };

  useEffect(() => {
    const bookmarkIds = getBookmarkIds();
    setBookmarkList(bookmarkIds);
    setIsBookmarkedState(bookmarkIds.includes(book_id));
  }, [book_id, setBookmarkList]);

  const handleBookmark = () => {
    let bookmarkIds = getBookmarkIds();

    if (bookmarkIds.includes(book_id)) {
      bookmarkIds = bookmarkIds.filter((id) => id !== book_id);
    } else {
      bookmarkIds.push(book_id);
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarkIds));
    setBookmarkList(bookmarkIds);
    setIsBookmarkedState(bookmarkIds.includes(book_id));
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
