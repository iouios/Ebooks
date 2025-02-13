"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchBookById } from "../../../store/bookSlice";
import { RootState, AppDispatch } from "../../../store/store";
import BookmarkButton from "../../../components/bookmarkButton";
import styled from "styled-components";

const UserPage = () => {
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
                    Read
                  </DownloadLink>
                )}
                <DownloadCount>
                  <strong>Download :</strong> {book.download_count}
                </DownloadCount>
              </Center>
            </BookInfo>
            <BookDetails>
              <Category>
                <strong>Category:</strong> {book.bookshelves.join(", ")}
              </Category>
              <Flex>
                <LeftSide>About This Book</LeftSide>
                <RightSide><BookmarkButton
                id={1}
                book_id={book.id}
                setBookmarkList={setBookmarkList}
                isBookmarked={bookmarkList.includes(book.id)}
              /></RightSide>
                
              </Flex>
              <Summary>
                {book.summaries.join(", ")}
              </Summary>
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
`;

const BookInfo = styled.div`
  background-color: var(--FONT_BLACK);
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: var(--FONT_WHITE);
`;

const Author = styled.p`
  font-size: 18px;
  color: var(--FONT_YELLOW);
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

const DownloadCount = styled.p`
  font-size: 16px;
  color: var(--FONT_YELLOW);
  margin-top: 10px;
`;

const DownloadLink = styled.a`
  display: inline-block;
  padding: 5px;
  background: var(--FONT_WHITE);

  text-decoration: none;
  border-radius: 5px;

`;

const BookDetails = styled.div`
  margin: 60px;
`;

const Category = styled.p`
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
`;

const RightSide = styled.div`
  padding: 20px;
  border-radius: 10px;
`;


export default UserPage;
