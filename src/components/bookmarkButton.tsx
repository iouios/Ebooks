"use client";
import React, { useState, useEffect } from "react";

interface BookmarkButtonProps {
  id: number;       
  book_id: number[]; 
  type: string;      
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ id, book_id, type }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {

    const bookmarks = localStorage.getItem("bookmarks");
    if (bookmarks) {
      const parsedBookmarks = JSON.parse(bookmarks);
      if (parsedBookmarks[id]) {
        setIsBookmarked(true); 
      }
    }
  }, [id]);

  const handleBookmark = () => {
    const bookmarks = localStorage.getItem("bookmarks");
    
    if (bookmarks) {
      const parsedBookmarks = JSON.parse(bookmarks);

      if (!parsedBookmarks[id]) {
        parsedBookmarks[id] = { book_id: [...book_id] };
        localStorage.setItem("bookmarks", JSON.stringify(parsedBookmarks));
        setIsBookmarked(true);
      } else {

        delete parsedBookmarks[id];
        localStorage.setItem("bookmarks", JSON.stringify(parsedBookmarks));
        setIsBookmarked(false);
      }
    } else {

      const newBookmarks = { [id]: { book_id } };
      localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <button onClick={handleBookmark}>
      {isBookmarked ? "ลบ Bookmark" : type === "add" ? "เพิ่ม Bookmark" : "ลบ Bookmark"}
    </button>
  );
};

export default BookmarkButton;
