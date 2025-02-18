"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchBookById } from "../../../store/bookSlice";
import { RootState, AppDispatch } from "../../../store/store";
import BookmarkButton from "../../../components/bookmarkButton";
import styled from "styled-components";
import Image from "next/image";

const BookPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const id = params.id as string;

  const { book, loading, error } = useSelector(
    (state: RootState) => state.books
  );

  const [bookmarkList, setBookmarkList] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(Number(id)));
    }
  }, [id, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              {book.formats["image/jpeg"] && (
                <ImageWrapper>
                  <BookImage
                    src={book.formats["image/jpeg"]}
                    alt={book.title}
                  />
                </ImageWrapper>
              )}
              <Center>
                {book.formats["application/epub+zip"] && (
                  <DownloadLink
                    href={book.formats["application/epub+zip"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Flexread>
                      <Imagesize
                        src="/images/Book open back.png"
                        alt="Bookmark"
                        width={20}
                        height={10}
                      />
                      Read
                    </Flexread>
                  </DownloadLink>
                )}
                <DownloadCount>
                  <FlexDownload>
                    <ImageDownload
                      src="/images/Download.png"
                      alt="Bookmark"
                      width={10}
                      height={10}
                    />
                    <strong>Download :</strong> {book.download_count}
                  </FlexDownload>
                </DownloadCount>
              </Center>
            </BookInfo>
            <BookDetails>
              <Category>
                <strong>
                  <FlexCategory>
                    <ImageCategory
                      src="/images/Book open.png"
                      alt="Bookmark"
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
  width: 100%;
`;

const BookContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`;

const BookInfo = styled.div`
  background-color: var(--FONT_BLACK);
  padding: 0 60px;
  padding: 20 0px;
  
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--FONT_WHITE);
`;

const Author = styled.p`
  font-size: 18px;
  color: #FFDD7E;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 200px;
  height: 250px;
`;

const BookImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 5px;
`;

const DownloadCount = styled.div`
  display: flex;
  font-size: 16px;
  color: var(--FONT_YELLOW);
`;

const DownloadLink = styled.a`
  display: inline-block;
  padding: 5px;
  background: var(--FONT_WHITE);
  margin: 10px;
  padding: 0 10px;
  border: 2px solid var(--FONT_YELLOW);
  text-decoration: none;
  border-radius: 8px;
`;

const BookDetails = styled.div`
  margin: 60px;
`;

const Category = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: bold;
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
`;

const LeftSide = styled.div`
  padding: 40px;
  border-radius: 10px;
  font-size: 26px;
  font-weight: bold;
`;

const RightSide = styled.div`
  padding: 20px;
  border-radius: 10px;
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

const FlexDownload = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  padding: 0 10px;
  padding: 5px;
  margin: 10px;
  text-decoration: none;
`;

const Imagesize = styled(Image)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  margin-top: 3px;

  @media (max-width: 500px) {
  }
`;

const ImageCategory = styled(Image)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  margin-top: 3px;

  @media (max-width: 500px) {
  }
`;

const ImageDownload = styled(Image)`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-left: 35px;

  @media (max-width: 500px) {
  }
`;

const CategorysContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin: 20px 0;
`;


const Categorys = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--ELEMENT_BROWN);
  color: var(--FONT_WHITE);
  text-decoration: none;
  border-radius: 25px;
  min-width: 100px;
  text-align: center;
`;

export default BookPage;
