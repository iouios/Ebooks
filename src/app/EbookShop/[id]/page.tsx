"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookmarkButton from "@/components/client/bookmarkButton";
import styled from "styled-components";
import { ReactReader } from "react-reader";
import { useUser } from "@auth0/nextjs-auth0/client";
import BookIcon from "../../../icon/book";
import DownloadIcon from "../../../icon/download";
import Swal from "sweetalert2";

interface Book {
  id: string;
  authors: string;
  bookshelves: string[];
  image_url: string;
  ebook_url: string;
  languages: string[];
  title: string;
  summaries: string;
  downloads: number;
  price: number;
  token: number;
}

const BookPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [bookmarkList, setBookmarkList] = useState<(string | number)[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  const { user } = useUser();

  // ดึงข้อมูลหนังสือ
  useEffect(() => {
    if (!id) return;
      console.log("Book id to find:", id);
    const fetchBookById = async () => {
      try {
        const res = await fetch("/api/ebookshop?page=1");
        if (!res.ok) throw new Error("Failed to fetch book list");
        const data = await res.json();
        const bookFound = data.results.find((b: Book) => b.id === id);
        if (!bookFound) throw new Error("Book not found");
        setBook(bookFound);
      } catch (error) {
        console.error(error);
        setBook(null);
      }
    };
    fetchBookById();
  }, [id]);

  // ดึง bookmark
  useEffect(() => {
    if (!user) return;
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userSub: user.sub }),
        });
        if (response.status === 404) {
          setBookmarkList([]);
          return;
        }
        if (!response.ok) throw new Error("โหลด bookmarks ล้มเหลว");
        const data = await response.json();
        setBookmarkList(data.book_ids || []);
      } catch (error) {
        console.error("ดึง bookmark ไม่สำเร็จ:", error);
      }
    };
    fetchBookmarks();
  }, [user]);

  // เช็คว่าซื้อแล้วหรือยัง
  useEffect(() => {
    if (!user || !book?.id) return;
    const checkIfPurchased = async () => {
      try {
        const res = await fetch("/api/user-book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.sub,
            book_id: book.id,
          }),
        });
        const data = await res.json();
        setHasPurchased(data.purchased);
      } catch (err) {
        console.error("เช็คการซื้อไม่สำเร็จ", err);
      }
    };
    checkIfPurchased();
  }, [user, book]);

  // อ่านหนังสือ
  const handleReadClick = () => {
    if (!book?.ebook_url) return;
    setIsReading(true);
  };

const handleBuyClick = async () => {
  console.log('handleBuyClick triggered');
  if (!book) return;

  const result = await Swal.fire({
    title: 'ยืนยันการซื้อหนังสือ?',
    text: `ต้องการซื้อ "${book.title}" ในราคา ${book.price} tokens หรือไม่?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ซื้อ',
    cancelButtonText: 'ยกเลิก',
  });

  console.log('confirm result:', result);
  if (!result.isConfirmed) return;

  const userId = user?.sub;
  console.log('userId:', userId);
  if (!userId) {
    await Swal.fire('กรุณาล็อกอินก่อนซื้อหนังสือ');
    return;
  }

  try {
    console.log('Sending purchase API request...');
    const response = await fetch('/api/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        book_id: book.id,
        // price: book.price,
      }),
    });
    console.log('API response:', response);

    const data = await response.json();
    console.log('API response data:', data);

    if (!response.ok) {
      if (data.message === "Token ไม่เพียงพอ") {
        await Swal.fire({
          icon: "warning",
          title: "Token ไม่เพียงพอ",
          text: "กรุณาซื้อ token เพิ่มเพื่อทำรายการนี้",
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'ซื้อไม่สำเร็จ',
          text: data.message || 'เกิดข้อผิดพลาดบางอย่าง',
        });
      }
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'ซื้อสำเร็จ!',
      text: `คุณซื้อ "${book.title}" เรียบร้อยแล้ว`,
    });

    window.location.reload();

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'ไม่สามารถติดต่อ server ได้';

    await Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: message,
    });
  }
};


  // อ่าน epub/pdf
  if (isReading && book?.ebook_url) {
    const ext = book.ebook_url.split(".").pop()?.toLowerCase();

    if (ext === "pdf") {
      if (typeof window !== "undefined") {
        window.location.href = book.ebook_url;
      }
      return null;
    }

    if (ext === "epub") {
      const proxyUrl = `/api/proxy-epub?url=${encodeURIComponent(book.ebook_url)}`;
      return (
        <div style={{ height: "100vh", position: "relative" }}>
          <button
            onClick={() => setIsReading(false)}
            style={{
              position: "absolute",
              zIndex: 1000,
              top: 10,
              left: 10,
              padding: "10px 15px",
              background: "#000000",
              border: "1px solid #000000",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#ffdd7e",
            }}
          >
            ← Back
          </button>
          <ReactReader
            url={proxyUrl}
            title={book.title}
            location={location}
            locationChanged={setLocation}
            showToc={true}
            getRendition={(rendition) => {
              rendition.themes.default({
                p: { color: "#333", lineHeight: "1.6" },
              });
            }}
          />
        </div>
      );
    }
  }

  

  return (
    <Main>
      {book && (
        <BookContainer>
          <BookInfo>
            <div>
              <Title>
                {book.title.length > 15 ? book.title.substring(0, 15) + "..." : book.title}
              </Title>
              <AuthorText>{book.authors}</AuthorText>
            </div>
            <CenterImage>
              {book.image_url && (
                <ImageWrapper>
                  <BookImage
                    src={book.image_url}
                    alt={book.title}
                    width={150}
                    height={200}
                  />
                </ImageWrapper>
              )}

              {/* ปุ่ม Read / Buy */}
              {hasPurchased ? (
                <DownloadLink onClick={handleReadClick}>
                  <Flexread>
                    <StyledBookIcon><BookIcon /></StyledBookIcon>
                    Read
                  </Flexread>
                </DownloadLink>
              ) : (
                <DownloadLink onClick={handleBuyClick}>
                  <Flexread>
                    ซื้อหนังสือ
                  </Flexread>
                </DownloadLink>
              )}
              <DownloadCount>
                <FlexDownload>
                  <Download><DownloadIcon width={15} height={15} /></Download>
                  <strong>Download : </strong> {book.downloads}
                </FlexDownload>
              </DownloadCount>
            </CenterImage>
          </BookInfo>

          <BookDetails>
            <Flex>
              <LeftSide>About This Book</LeftSide>
              <RightSide>
                <BookmarkButton
                  book_id={book.id}
                  setBookmarkList={setBookmarkList}
                  isBookmarked={bookmarkList.includes(book.id)}
                />
              </RightSide>
            </Flex>
            <Summary>{book.summaries}</Summary>
          </BookDetails>
        </BookContainer>
      )}
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: 100vh;
  overflow: auto;
`;

const StyledBookIcon = styled.div`
  margin-right: 10px;
  margin-top: 2px;
`;

const BookContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;

  @media (max-width: 500px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
`;

const BookInfo = styled.div`
  background-color: var(--FONT_BLACK);
  padding: 20px 60px;
  position: relative;

  @media (max-width: 500px) {
    padding: 0px 12px;
    margin: 0 auto;
    min-height: 100vh;
    overflow: auto;
  }
    @media (max-width: 400px) {
    padding: 0px 2px;
    margin: 0 auto;
    min-height: 100vh;
    overflow: auto;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--FONT_WHITE);
  @media (max-width: 500px) {
    padding: 10px 10px;
  }
`;

const AuthorText = styled.p`
  font-size: 18px;
  color: #ffdd7e;
  @media (max-width: 500px) {
    padding: 10px 10px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 200px;
  height: 250px;
  @media (max-width: 500px) {
    justify-content: start;
    width: 150px;
    height: 200px;
  }
`;

const BookImage = styled.img`
  width: 150px;
  height: 200px;
  border-radius: 5px;
`;

const DownloadLink = styled.button`
  display: inline-block;
  padding: 5px 10px;
  background: var(--FONT_WHITE);
  border: 2px solid var(--FONT_YELLOW);
  text-decoration: none;
  border-radius: 8px;
  @media (max-width: 500px) {
    padding: 0px 5px;
    margin-left: 0px;
  }
`;

const BookDetails = styled.div`
  flex-grow: 1;
  width: 100%;
  min-width: 0;
  padding: 60px;
  box-sizing: border-box;
  @media (max-width: 500px) {
    padding: 25px;
  }
`;

const Summary = styled.p`
  font-size: 14px;
`;


const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
  @media (max-width: 500px) {
    gap: 0px;
    flex-direction: column;
  }
`;

const LeftSide = styled.div`
  border-radius: 10px;
  font-size: 26px;
  font-weight: bold;
  @media (min-width: 500px) {
    padding: 40px;
  }
  @media (max-width: 500px) {
    order: 2;
    font-size: 18px;
    padding-bottom: 15px;
  }
`;

const RightSide = styled.div`
  border-radius: 10px;
  @media (min-width: 500px) {
    padding: 20px;
  }
  @media (max-width: 500px) {
    order: 1;
    padding-bottom: 10px;
    border-radius: 10px;
  }
`;

const Flexread = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
`;


const CenterImage = styled.div`
  text-align: center;
`;

const FlexDownload = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 5px 0px;
  margin: 10px;
  @media (max-width: 500px) {
    padding: 0px 0px;
  }
`;

const DownloadCount = styled.div`
  font-size: 16px;
  color: var(--FONT_YELLOW);
  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const Download = styled.div`
  margin: 2px 10px;
`;


export default BookPage;
