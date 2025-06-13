"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import axios from "axios";
import { fetchBookById } from "../../../store/bookSlice";
import { RootState, AppDispatch } from "../../../store/store";
import BookmarkButton from "@/components/client/bookmarkButton";
import styled from "styled-components";
import Image from "next/image";
import { ReactReader } from "react-reader";
import { useUser } from "@auth0/nextjs-auth0/client";

const BookPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.id as string;

  const { book} = useSelector(
    (state: RootState) => state.books
  );

  const [bookmarkList, setBookmarkList] = useState<(number | string)[]>([]);
  const [epubPath, setEpubPath] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showReader, setShowReader] = useState<boolean>(false);
  const [location, setLocation] = useState<string | number>(0);
    const { user } = useUser();


  useEffect(() => {
    if (!user) return;
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userSub: user.sub }),
        });
        if (!response.ok) throw new Error("โหลด bookmarks ล้มเหลว");
        const data = await response.json();
        setBookmarkList(data.book_ids || []);
      } catch (error) {
        console.error("ดึง bookmark ไม่สำเร็จ:", error);
      }
    };
    fetchBookmarks();
  }, [user]);
    
  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [id, dispatch]);

  const downloadEpub = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!epubPath && book?.formats["application/epub+zip"]) {
      e.preventDefault();
      setIsDownloading(true);
      try {
        const epubUrl = book.formats["application/epub+zip"];

        const response = await axios.get(
          `/api/download?url=${encodeURIComponent(epubUrl)}`
        );

        setEpubPath(response.data.filePath);

        setShowReader(true);
      } catch (error) {
        console.error("Failed to download EPUB:", error);
      } finally {
        setIsDownloading(false);
      }
    } else if (epubPath) {
      e.preventDefault();
      setShowReader(true);
    }
  };

  return (
    <Main>
      {book ? (
        <>
          <BookContainer>
            <BookInfo>
              <div>
                <Title>
                  {book.title.length > 15
                    ? book.title.substring(0, 15) + "..."
                    : book.title}
                </Title>
                <Author>
                  {book.authors.map((author) => author.name).join(", ")}
                </Author>
              </div>
              <CenterImage>
                {book.formats["image/jpeg"] && (
                  <ImageWrapper>
                    <BookImage
                      src={book.formats["image/jpeg"]}
                      alt={book.title}
                    />
                  </ImageWrapper>
                )}
                {book.formats["application/epub+zip"] && (
                  <DownloadLink href="#" onClick={downloadEpub}>
                    <Flexread>
                      <Imagesize
                        src="/images/Book open back.png"
                        alt="Read Book"
                        width={20}
                        height={10}
                      />
                      {isDownloading ? "Downloading..." : "Read"}
                    </Flexread>
                  </DownloadLink>
                )}
                <DownloadCount>
                  <FlexDownload>
                    <ImageDownload
                      src="/images/Download.png"
                      alt="Download Icon"
                      width={10}
                      height={10}
                    />
                    <strong>Download :</strong> {book.download_count}
                  </FlexDownload>
                </DownloadCount>
              </CenterImage>
              <Center>
                <Categoryon>
                  <strong>
                    <FlexCategoryon>
                      <ImageCategory
                        src="/images/Book open.png"
                        alt="Category Icon"
                        width={20}
                        height={10}
                      />
                      Category
                    </FlexCategoryon>
                  </strong>
                  <CategorysContainer>
                    {book.bookshelves.map((shelf, index) => (
                      <Categorys key={index}>
                        {shelf.replace("Browsing: ", "")}
                      </Categorys>
                    ))}
                  </CategorysContainer>
                </Categoryon>
              </Center>
            </BookInfo>
            <BookDetails>
              <Category>
                <strong>
                  <FlexCategory>
                    <ImageCategory
                      src="/images/Book open.png"
                      alt="Category Icon"
                      width={20}
                      height={10}
                    />
                    Category
                  </FlexCategory>
                </strong>
                <CategorysContainer>
                  {book.bookshelves.map((shelf, index) => (
                    <Categorys key={index}>
                      {shelf.replace("Browsing: ", "")}
                    </Categorys>
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
              <Summary>{book.summaries.join(", ")}</Summary>
            </BookDetails>
          </BookContainer>
          {showReader && epubPath && (
            <ReaderContainer>
              <ReactReader
                url={epubPath}
                location={location}
                locationChanged={(epubcfi: string) => setLocation(epubcfi)}
              />
            </ReaderContainer>
          )}
        </>
      ) : (
        <div>No book found</div>
      )}
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow: auto;
`;

const BookContainer = styled.div`
  display: flex;

  height: 100vh;
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
    padding: 2px 2px;
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

const Author = styled.p`
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

const DownloadCount = styled.div`
  font-size: 16px;
  color: var(--FONT_YELLOW);
  @media (max-width: 500px) {
    font-size: 14px;
  }
`;

const DownloadLink = styled.a`
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
  margin: 60px;
  @media (max-width: 500px) {
    margin: 30px;
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

const Imagesize = styled(Image)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  margin-top: 3px;
`;

const ImageCategory = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  margin-top: 3px;
`;

const ImageDownload = styled(Image)`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 35px;
  @media (max-width: 500px) {
    width: 15px;
    height: 15px;
    margin-left: 10px;
  }
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

const ReaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: #fff;
`;

const CenterImage = styled.div`
  text-align: center;
`;

export default BookPage;
