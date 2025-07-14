"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BookmarkButton from "@/components/client/bookmarkButton";
import styled from "styled-components";
import { ReactReader } from "react-reader";
import { useUser } from "@auth0/nextjs-auth0/client";
import BookIcon from "../../../icon/book";
import DownloadIcon from "../../../icon/download";

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
}

const BookPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [bookmarkList, setBookmarkList] = useState<(string | number)[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!id) return;

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
        if (!response.ok) {
          throw new Error(`โหลด bookmarks ล้มเหลว: ${response.status}`);
        }
        const data = await response.json();
        setBookmarkList(data.book_ids || []);
      } catch (error) {
        console.error("ดึง bookmark ไม่สำเร็จ:", error);
      }
    };
    fetchBookmarks();
  }, [user]);

  const handleReadClick = () => {
    if (!book?.ebook_url) return;
    setIsReading(true);
  };

  if (isReading && book?.ebook_url) {
    const ext = book.ebook_url.split(".").pop()?.toLowerCase();

    if (ext === "pdf") {
      if (typeof window !== "undefined") {
        window.location.href = book.ebook_url;
      }
      return null;
    }

    if (ext === "epub") {
      const proxyUrl = `/api/proxy-epub?url=${encodeURIComponent(
        book.ebook_url
      )}`;

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
                p: {
                  color: "#333",
                  lineHeight: "1.6",
                },
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
                {book.title.length > 15
                  ? book.title.substring(0, 15) + "..."
                  : book.title}
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
              <DownloadLink onClick={handleReadClick}>
                <Flexread>
                  <StyledBookIcon>
                    <BookIcon />
                  </StyledBookIcon>
                  Read
                </Flexread>
              </DownloadLink>
              <DownloadCount>
                <FlexDownload>
                  <Download>
                    <DownloadIcon width={15} height={15} />
                  </Download>
                  <strong>Download : </strong> {book.downloads}
                </FlexDownload>
              </DownloadCount>
            </CenterImage>
            <Center>
              <Categoryon>
                <strong>
                  <FlexCategoryon>
                    <StyledIconMargin>
                      <BookIcon
                        width={30}
                        height={30}
                        color="var(--FONT_YELLOW)"
                      />
                    </StyledIconMargin>
                    Category
                  </FlexCategoryon>
                </strong>
                <CategorysContainer>
                  {book.bookshelves.map((shelf, index) => (
                    <Categorys key={index}>{shelf}</Categorys>
                  ))}
                </CategorysContainer>
              </Categoryon>
            </Center>
          </BookInfo>
          <BookDetails>
            <Category>
              <strong>
                <FlexCategory>
                  <StyledIconMargin>
                    <BookIcon
                      width={40}
                      height={40}
                      color="var(--FONT_YELLOW)"
                    />
                  </StyledIconMargin>
                  Category
                </FlexCategory>
              </strong>
              <CategorysContainer>
                {book.bookshelves.map((shelf, index) => (
                  <Categorys key={index}>{shelf}</Categorys>
                ))}
              </CategorysContainer>
            </Category>
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

const StyledIconMargin = styled.div`
  margin-right: 20px;
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

const Category = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Categoryon = styled.div`
  font-size: 12px;
  font-weight: bold;
  @media (min-width: 500px) {
    display: none;
  }
`;

const Summary = styled.p`
  font-size: 14px;
`;

const Center = styled.div`
  text-align: center;
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

const FlexCategory = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  background: var(--FONT_WHITE);
  margin: 10px;
  padding-top: 12px;
  text-decoration: none;
  font-size: 24px;
`;

const FlexCategoryon = styled.div`
  display: flex;
  color: var(--FONT_WHITE);
  margin: 10px;
  padding-top: 12px;
  text-decoration: none;
  font-size: 20px;
`;

const CategorysContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px;
  @media (max-width: 500px) {
    margin: 0px;
  }
`;

const Categorys = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 5px;
  background: var(--ELEMENT_BROWN);
  color: var(--FONT_WHITE);
  text-decoration: none;
  border-radius: 25px;
  min-width: 100px;
  text-align: center;
  @media (max-width: 500px) {
    padding: 10px;
    margin-left: 45px;
  }
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
