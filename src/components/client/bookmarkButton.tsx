import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";


interface BookmarkButtonProps {
  book_id: number;
  setBookmarkList: React.Dispatch<React.SetStateAction<number[]>>;
}

interface BookmarkRequestBody {
  userId: string;
  bookId: number;
}

interface UserData {
  auth0_id: string;
  book_ids: number[];
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  book_id,
  setBookmarkList,
}) => {
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null); 

  useEffect(() => {
    if (!user) return;
  
    const fetchBookmarksFromAPI = async () => {
      const userSub = user.sub;
  
      if (!userSub) return;
  
      try {

        const response = await fetch('/api/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userSub }),
        });
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูล bookmarks จาก API ได้");
        }
        const data = await response.json();
        console.log("Bookmarks จาก API:", data);
  
        const book_ids = data.book_ids || [];
        setBookmarkList(book_ids);
  
        setIsBookmarked(book_ids.includes(book_id));
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล bookmarks:", error);
      }
    };
  
    fetchBookmarksFromAPI();
  }, [user, book_id, setBookmarkList]);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      console.log("userSub:", user.sub);
  
      const userSub = user.sub;
      if (userSub) {
        fetch('/api/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userSub }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch data from API");
            }
            return response.json();
          })
          .then((data) => {
            setUserData(data);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    }
  }, [user]);

  const handleBookmark = async () => {
    if (!user) {
      if (window.confirm("กรุณาเข้าสู่ระบบก่อนบันทึก Bookmark")) {
        window.location.href = "/api/auth/login";
      }
      return;
    }
  
    try {
      let endpoint = '';
      let method: 'POST' | 'DELETE' = 'POST';
  
      const body: BookmarkRequestBody = { userId: user.sub!, bookId: book_id };
  
      if (isBookmarked) {
        endpoint = `/api/bookmark/remove/${book_id}`;
        method = 'DELETE';
      } else {
        endpoint = `/api/bookmark/add/${book_id}`;
        method = 'POST';
      }
  
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },

        body: method === 'POST' || method === 'DELETE' ? JSON.stringify(body) : undefined,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        alert(`Error: ${errorData.message}`);
        return;
      }
  
      const data = await response.json(); 
      console.log(data.message);
  
      if (response.ok) {
        setIsBookmarked(!isBookmarked);

      }
      
  
    } catch (error) {
      console.error("Error in bookmark request:", error);
      alert("เกิดข้อผิดพลาดในการดำเนินการกับ Bookmark");
    }
  };
  
  console.log("Bookmark status:", isBookmarked); 
  console.log("User ID:", user?.sub); 
  console.log("Book ID:", book_id); 
  console.log("user", user);
  console.log("userData", userData); 

  return(
    
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
